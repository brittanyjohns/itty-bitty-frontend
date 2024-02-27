export interface Image {
    id: string; // Assuming each image has a unique ID for key purposes
    src: string;
    label: string;
    audio?: string; // Make audio optional
  }
  
  export interface ImageGalleryProps {
    images: Image[];
  }

// fetch('http://localhost:3000/api/images')
const BASE_URL = '10.0.2.2'; // 'localhost'


export const getImages = () => {
    const images = fetch(`http://${BASE_URL}:3000/api/images`) // `http://localhost:3000/api/images
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return images;
}