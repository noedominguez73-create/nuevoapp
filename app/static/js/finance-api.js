/**
 * Finance API Helper
 * Manages communication with backend API replacing localStorage
 */

const FinanceAPI = {
    baseURL: '/api/finance',

    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem('token');
    },

    // Helper for fetch with auth
    async request(endpoint, options = {}) {
        const token = this.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    },

    // ============ DATA ============

    async getAllData() {
        return await this.request('/data');
    },

    // ============ ACCOUNTS ============

    async getAccounts() {
        return await this.request('/accounts');
    },

    async createAccount(data) {
        return await this.request('/accounts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateAccount(id, data) {
        return await this.request(`/accounts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteAccount(id) {
        return await this.request(`/accounts/${id}`, {
            method: 'DELETE'
        });
    },

    // ============ TRANSACTIONS ============

    async getTransactions() {
        return await this.request('/transactions');
    },

    async createTransaction(data) {
        return await this.request('/transactions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async deleteTransaction(id) {
        return await this.request(`/transactions/${id}`, {
            method: 'DELETE'
        });
    },

    // ============ BILLS ============

    async getBills() {
        return await this.request('/bills');
    },

    async createBill(data) {
        return await this.request('/bills', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateBill(id, data) {
        return await this.request(`/bills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteBill(id) {
        return await this.request(`/bills/${id}`, {
            method: 'DELETE'
        });
    },

    // ============ CATEGORIES ============

    async getCategories() {
        return await this.request('/categories');
    },

    async createCategory(data) {
        return await this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// Export for use in finance pages
window.FinanceAPI = FinanceAPI;
