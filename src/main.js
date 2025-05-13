import { ImageGallery } from './imageService.js';

class SearchForm {
  constructor() {
    this.form = document.getElementById('searchForm');
    this.input = document.getElementById('searchInput');
    this.errorElement = document.getElementById('searchError');
    this.gallery = new ImageGallery('grid-container');
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.input.addEventListener('input', (e) => this.handleInput(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const query = this.input.value.trim();
    
    if (!this.validateQuery(query)) {
      return;
    }

    try {
      this.hideError();
      await this.gallery.searchImages(query);
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

const buscador = new SearchForm();

let page = 1;
let loading = false;
const gridContainer = document.getElementById('grid-container');

// Función para crear un elemento de imagen
function createImageElement() {
    const box = document.createElement('div');
    box.className = 'box';
    
    // Decidir aleatoriamente el tipo de box
    const random = Math.random();
    if (random < 0.2) {
        box.classList.add('box-landscape');
    } else if (random < 0.4) {
        box.classList.add('box-portrait');
    } else if (random < 0.6) {
        box.classList.add('box-double');
    }
    
    const img = document.createElement('img');
    img.src = `https://picsum.photos/320/320?grayscale&random=${Math.random()}`;
    img.alt = 'Random Img';
    
    box.appendChild(img);
    return box;
}

// Función para cargar más imágenes
function loadMoreImages() {
    if (loading) return;
    loading = true;
    
    // Simular delay de carga
    setTimeout(() => {
        // Añadir 10 imágenes más
        for (let i = 0; i < 10; i++) {
            const imageElement = createImageElement();
            gridContainer.appendChild(imageElement);
        }
        loading = false;
        page++;
    }, 500);
}

// Configurar el Intersection Observer
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadMoreImages();
        }
    });
}, options);

// Crear y observar el elemento sentinel
const sentinel = document.createElement('div');
sentinel.className = 'sentinel';
sentinel.style.height = '10px';
sentinel.style.width = '100%';
gridContainer.appendChild(sentinel);
observer.observe(sentinel);

// Cargar imágenes iniciales
loadMoreImages();