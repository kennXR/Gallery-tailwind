import { ImageService } from '../services/ImageService.js';

export class ImageGallery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.imageService = new ImageService();
        this.page = 1;
        this.loading = false;
        this.imageCount = 0;
        this.currentQuery = '';
        this.setupIntersectionObserver();
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

        this.sentinel = this.createSentinel();
        this.container.appendChild(this.sentinel);
        this.observer.observe(this.sentinel);
    }

    createSentinel() {
        const sentinel = document.createElement('div');
        sentinel.className = 'sentinel';
        sentinel.style.height = '1px';
        sentinel.style.width = '100%';
        return sentinel;
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.loading) {
                this.loadMoreImages();
            }
        });
    }

    createImageBox(imageUrl, type = 'normal') {
        const box = document.createElement('div');
        box.className = 'box';
        
        if (type !== 'normal') {
            box.classList.add(`box-${type}`);
        }
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Gallery Image';
        img.loading = 'lazy';
        
        box.appendChild(img);
        return box;
    }

    getImageDimensions(type) {
        const dimensions = {
            'landscape': { width: 640, height: 320 },
            'portrait': { width: 320, height: 640 },
            'double': { width: 640, height: 640 },
            'normal': { width: 320, height: 320 }
        };
        return dimensions[type];
    }

    async loadMoreImages() {
        if (this.loading) return;
        this.loading = true;

        try {
            const imageTypes = ['normal', 'landscape', 'portrait', 'double'];
            for (let i = 0; i < 15; i++) {
                const type = imageTypes[this.imageCount % 4];
                const { width, height } = this.getImageDimensions(type);
                const imageUrl = this.imageService.getRandomImageUrl(width, height);
                const imageBox = this.createImageBox(imageUrl, type);
                this.container.appendChild(imageBox);
                this.imageCount++;
            }
            this.page++;
        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            this.loading = false;
        }
    }

    clearGallery() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(this.sentinel);
        this.imageCount = 0;
        this.page = 1;
    }

    async searchImages(query) {
        this.currentQuery = query;
        this.clearGallery();
        await this.loadMoreImages();
    }
} 