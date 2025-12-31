/**
 * Beautiful Modal System
 * Replaces ugly browser alert(), confirm(), and prompt() with beautiful custom modals
 * Usage:
 *   BeautifulModal.confirm('¿Estás seguro?', 'Esta acción no se puede deshacer').then(confirmed => { ... })
 *   BeautifulModal.prompt('Nombre:', 'Ingresa un nombre').then(value => { ... })
 *   BeautifulModal.alert('¡Éxito!', 'Operación completada')
 */

const BeautifulModal = {
    /**
     * Show confirmation dialog
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @param {object} options - { confirmText, cancelText, danger }
     * @returns {Promise<boolean>} - true if confirmed, false if cancelled
     */
    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const {
                confirmText = 'Confirmar',
                cancelText = 'Cancelar',
                danger = true
            } = options;

            const modal = this._createModal(`
                <div class="w-16 h-16 bg-${danger ? 'red' : 'blue'}-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${danger ? 'alert-triangle' : 'help-circle'}" class="h-8 w-8 text-${danger ? 'red' : 'blue'}-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 text-center mb-2">${title}</h3>
                <p class="text-sm text-gray-500 text-center mb-6">${message}</p>
                <div class="flex gap-3">
                    <button data-action="cancel" class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        ${cancelText}
                    </button>
                    <button data-action="confirm" class="flex-1 px-4 py-3 bg-${danger ? 'red' : 'blue'}-600 text-white rounded-xl font-medium hover:bg-${danger ? 'red' : 'blue'}-700 transition-colors shadow-lg shadow-${danger ? 'red' : 'blue'}-200">
                        ${confirmText}
                    </button>
                </div>
            `);

            modal.querySelector('[data-action="confirm"]').onclick = () => {
                this._closeModal(modal);
                resolve(true);
            };

            modal.querySelector('[data-action="cancel"]').onclick = () => {
                this._closeModal(modal);
                resolve(false);
            };

            modal.onclick = (e) => {
                if (e.target === modal) {
                    this._closeModal(modal);
                    resolve(false);
                }
            };
        });
    },

    /**
     * Show prompt dialog
     * @param {string} title - Modal title
     * @param {string} placeholder - Input placeholder
     * @param {string} defaultValue - Default input value
     * @returns {Promise<string|null>} - Input value or null if cancelled
     */
    prompt(title, placeholder = '', defaultValue = '') {
        return new Promise((resolve) => {
            const inputId = 'modal-input-' + Date.now();

            const modal = this._createModal(`
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="edit-3" class="h-8 w-8 text-purple-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 text-center mb-2">${title}</h3>
                <input 
                    type="text" 
                    id="${inputId}"
                    value="${defaultValue}"
                    placeholder="${placeholder}"
                    class="w-full rounded-xl border-gray-200 border p-3 mb-6 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all text-gray-900"
                    autofocus
                >
                <div class="flex gap-3">
                    <button data-action="cancel" class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        Cancelar
                    </button>
                    <button data-action="confirm" class="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                        Aceptar
                    </button>
                </div>
            `);

            const input = modal.querySelector(`#${inputId}`);

            const submit = () => {
                const value = input.value.trim();
                if (value) {
                    this._closeModal(modal);
                    resolve(value);
                } else {
                    input.classList.add('border-red-500');
                    input.focus();
                }
            };

            input.onkeypress = (e) => {
                if (e.key === 'Enter') submit();
            };

            modal.querySelector('[data-action="confirm"]').onclick = submit;

            modal.querySelector('[data-action="cancel"]').onclick = () => {
                this._closeModal(modal);
                resolve(null);
            };

            modal.onclick = (e) => {
                if (e.target === modal) {
                    this._closeModal(modal);
                    resolve(null);
                }
            };

            // Focus input after animation
            setTimeout(() => input.focus(), 100);
        });
    },

    /**
     * Show alert/success message
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @param {string} type - 'success', 'error', 'info'
     */
    alert(title, message, type = 'success') {
        return new Promise((resolve) => {
            const colors = {
                success: { bg: 'green', icon: 'check-circle' },
                error: { bg: 'red', icon: 'x-circle' },
                info: { bg: 'blue', icon: 'info' }
            };

            const { bg, icon } = colors[type] || colors.info;

            const modal = this._createModal(`
                <div class="w-16 h-16 bg-${bg}-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${icon}" class="h-8 w-8 text-${bg}-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 text-center mb-2">${title}</h3>
                <p class="text-sm text-gray-500 text-center mb-6">${message}</p>
                <button data-action="close" class="w-full px-4 py-3 bg-${bg}-600 text-white rounded-xl font-medium hover:bg-${bg}-700 transition-colors shadow-lg shadow-${bg}-200">
                    Aceptar
                </button>
            `);

            modal.querySelector('[data-action="close"]').onclick = () => {
                this._closeModal(modal);
                resolve();
            };

            modal.onclick = (e) => {
                if (e.target === modal) {
                    this._closeModal(modal);
                    resolve();
                }
            };
        });
    },

    /**
     * Create modal element
     * @private
     */
    _createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-slideIn">
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        return modal;
    },

    /**
     * Close and remove modal
     * @private
     */
    _closeModal(modal) {
        const content = modal.querySelector('div');
        content.style.transform = 'scale(0.95)';
        content.style.opacity = '0';
        modal.style.opacity = '0';

        setTimeout(() => {
            modal.remove();
        }, 200);
    }
};

// Add slideIn animation to document if not already present
if (!document.querySelector('style[data-beautiful-modal]')) {
    const style = document.createElement('style');
    style.setAttribute('data-beautiful-modal', 'true');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        .animate-slideIn {
            animation: slideIn 0.2s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Export for use
window.BeautifulModal = BeautifulModal;
