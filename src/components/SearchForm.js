export class SearchForm {
    constructor(formId, inputId, errorId) {
        this.form = document.getElementById(formId);
        this.input = document.getElementById(inputId);
        this.errorElement = document.getElementById(errorId);
        this.onSearch = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.input.addEventListener('input', () => this.handleInput());
    }

    setSearchCallback(callback) {
        this.onSearch = callback;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const query = this.input.value.trim();
        
        if (!this.validateQuery(query)) {
            return;
        }

        try {
            this.hideError();
            if (this.onSearch) {
                await this.onSearch(query);
            }
        } catch (error) {
            this.showError('Error al buscar imágenes. Por favor, intenta de nuevo.');
        }
    }

    handleInput() {
        const query = this.input.value.trim();
        this.validateQuery(query);
    }

    validateQuery(query) {
        if (query.length < 3) {
            this.showError('La búsqueda debe tener al menos 3 caracteres');
            return false;
        }

        if (query.length > 50) {
            this.showError('La búsqueda no puede tener más de 50 caracteres');
            return false;
        }

        this.hideError();
        return true;
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.classList.remove('hidden');
    }

    hideError() {
        this.errorElement.classList.add('hidden');
    }
} 