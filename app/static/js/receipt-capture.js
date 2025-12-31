/**
 * Receipt Photo Capture System
 * Handles camera/upload functionality for transaction receipts
 * Storage: Base64 in localStorage via FinanceCore
 */

const ReceiptCapture = {
    activeTransactionId: null,
    videoStream: null,

    /**
     * Open camera to take photo of receipt
     * @param {string} transactionId - ID of transaction to attach receipt to
     */
    async openCamera(transactionId) {
        this.activeTransactionId = transactionId;
        const modal = document.getElementById('camera-modal');
        const video = document.getElementById('camera-feed');

        try {
            // Request camera access
            this.videoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // Use back camera on mobile
                audio: false
            });

            video.srcObject = this.videoStream;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('No se pudo acceder a la cámara. Abriendo selector de archivos...');
            this.openUpload(transactionId);
        }
    },

    /**
     * Take photo from video stream
     */
    takePhoto() {
        const video = document.getElementById('camera-feed');
        const canvas = document.getElementById('camera-canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0);

        // Convert to Base64
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);

        // Save to transaction
        this.saveReceipt(this.activeTransactionId, base64Image);

        // Close camera
        this.closeCamera();
    },

    /**
     * Close camera modal and stop video stream
     */
    closeCamera() {
        const modal = document.getElementById('camera-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');

        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.videoStream = null;
        }
    },

    /**
     * Open file upload dialog
     * @param {string} transactionId - ID of transaction to attach receipt to
     */
    openUpload(transactionId) {
        this.activeTransactionId = transactionId;
        const input = document.getElementById('upload-input');

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.processImageFile(file);
            }
        };

        input.click();
    },

    /**
     * Convert uploaded image file to Base64
     * @param {File} file - Image file
     */
    processImageFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const base64Image = e.target.result;
            this.saveReceipt(this.activeTransactionId, base64Image);
        };

        reader.readAsDataURL(file);
    },

    /**
     * Save receipt to transaction
     * @param {string} transactionId - Transaction ID
     * @param {string} base64Image - Base64 encoded image
     */
    saveReceipt(transactionId, base64Image) {
        FinanceCore.attachTransactionDocument(transactionId, base64Image);

        // Show success message
        if (FinanceCore.showToast) {
            FinanceCore.showToast('Comprobante guardado correctamente', 'success');
        } else {
            alert('✅ Comprobante guardado');
        }

        // Refresh UI if we're on account details
        if (typeof updateAccountDetailsUI === 'function') {
            updateAccountDetailsUI();
        }

        // Clear input
        document.getElementById('upload-input').value = '';
    },

    /**
     * View receipt in fullscreen modal
     * @param {string} transactionId - Transaction ID
     */
    viewReceipt(transactionId) {
        const transaction = FinanceCore.getTransactions().find(t => t.id === transactionId);

        if (!transaction || !transaction.document) {
            alert('No hay comprobante adjunto');
            return;
        }

        const modal = document.getElementById('receipt-modal');
        const img = document.getElementById('receipt-image');

        img.src = transaction.document;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    /**
     * Close receipt viewer modal
     */
    closeReceiptViewer() {
        const modal = document.getElementById('receipt-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');

        // Clear image source
        document.getElementById('receipt-image').src = '';
    },

    /**
     * Delete receipt from transaction
     * @param {string} transactionId - Transaction ID
     */
    deleteReceipt(transactionId) {
        if (!confirm('¿Eliminar comprobante?')) return;

        const transaction = FinanceCore.getTransactions().find(t => t.id === transactionId);
        if (transaction) {
            delete transaction.document;
            FinanceCore.saveData();

            if (FinanceCore.showToast) {
                FinanceCore.showToast('Comprobante eliminado', 'success');
            }

            // Refresh UI
            if (typeof updateAccountDetailsUI === 'function') {
                updateAccountDetailsUI();
            }
        }
    }
};

// Expose global functions for onclick handlers
window.openCameraForReceipt = (transactionId) => ReceiptCapture.openCamera(transactionId);
window.openUploadForReceipt = (transactionId) => ReceiptCapture.openUpload(transactionId);
window.takePhoto = () => ReceiptCapture.takePhoto();
window.closeCameraModal = () => ReceiptCapture.closeCamera();
window.viewReceipt = (transactionId) => ReceiptCapture.viewReceipt(transactionId);
window.closeReceiptModal = () => ReceiptCapture.closeReceiptViewer();
window.deleteReceipt = (transactionId) => ReceiptCapture.deleteReceipt(transactionId);
