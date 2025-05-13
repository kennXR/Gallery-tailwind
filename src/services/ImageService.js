const API_KEY = "NunlpCpYzpi3cZNdTxxwrgi-c8Ky1TUz8n_cg41cvPQ";

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
            return data.results;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    getRandomImageUrl(width, height) {
        return `https://picsum.photos/${width}/${height}?grayscale&random=${Math.random()}`;
    }
} 