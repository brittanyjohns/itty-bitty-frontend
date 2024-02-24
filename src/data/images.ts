export interface Image {
    label: string;
    src: string;
    audio: string;
}

// fetch('http://localhost:3000/api/images')


export const getImages = () => {
    const images = fetch('http://localhost:3000/api/images')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return images;
}