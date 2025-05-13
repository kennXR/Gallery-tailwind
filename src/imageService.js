// https://unsplash.com/es/%C3%BAnete
const API_KEY = "NunlpCpYzpi3cZNdTxxwrgi-c8Ky1TUz8n_cg41cvPQ"
export class ImageService {
  constructor() {
    this.BASE_URL = 'https://api.unsplash.com';
    this.imagesPerPage = 30;
  }

  async searchImages(query, page = 1) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${this.imagesPerPage}`,
        {
          headers: {
            'Authorization': `Client-ID ${API_KEY}`
          }
        }
      );
      if (!response.ok) {
          throw new Error('Error al buscar imágenes');
        }
        
        const data = await response.json();
        console.log("data", data);
      return data.results;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export class ImageGallery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.page = 1;
        this.loading = false;
        this.imageCount = 0;
        this.setupIntersectionObserver();
        this.loadInitialImages();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            options
        );

        this.sentinel = document.createElement('div');
        this.sentinel.className = 'sentinel';
        this.sentinel.style.height = '1px';
        this.sentinel.style.width = '100%';
        this.container.appendChild(this.sentinel);
        this.observer.observe(this.sentinel);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadMoreImages();
            }
        });
    }

    createImageElement() {
        const box = document.createElement('div');
        box.className = 'box';
        
        // Distribuir los tipos de imagen de manera más uniforme
        const pattern = this.imageCount % 5;
        
        if (pattern === 0) {
            box.classList.add('box-landscape');
        } else if (pattern === 1) {
            box.classList.add('box-portrait');
        } else if (pattern === 2) {
            box.classList.add('box-double');
        }
        
        const img = document.createElement('img');
        img.src = this.getImageUrl(box.classList);
        img.alt = 'Random Img';
        img.loading = 'lazy'; // Añadimos lazy loading para optimizar el rendimiento
        
        box.appendChild(img);
        this.imageCount++;
        return box;
    }

    getImageUrl(classList) {
        if (classList.contains('box-landscape')) {
            return `https://picsum.photos/640/320?grayscale&random=${Math.random()}`;
        } else if (classList.contains('box-portrait')) {
            return `https://picsum.photos/320/640?grayscale&random=${Math.random()}`;
        } else if (classList.contains('box-double')) {
            return `https://picsum.photos/640/640?grayscale&random=${Math.random()}`;
        }
        return `https://picsum.photos/320/320?grayscale&random=${Math.random()}`;
    }

    async loadMoreImages() {
        if (this.loading) return;
        this.loading = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            for (let i = 0; i < 15; i++) {
                const imageElement = this.createImageElement();
                this.container.appendChild(imageElement);
            }
            this.page++;
        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            this.loading = false;
        }
    }

    loadInitialImages() {
        this.loadMoreImages();
    }

    // Método para limpiar la galería (útil para búsquedas)
    clearGallery() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(this.sentinel);
        this.imageCount = 0;
        this.page = 1;
    }

    // Método para buscar imágenes (se puede implementar con una API real)
    async searchImages(query) {
        this.clearGallery();
        await this.loadMoreImages();
    }
} 