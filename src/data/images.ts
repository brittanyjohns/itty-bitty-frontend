export interface Image {
    id: string; // Assuming each image has a unique ID for key purposes
    src: string;
    label: string;
    audio?: string; // Make audio optional
  }
  
  export interface ImageGalleryProps {
    images: Image[];
  }

// fetch('http://localhostimages')
// const BASE_URL = '10.0.2.2'; // 'localhost'
const BASE_URL = 'localhost:4000/api/'; // 'localhost'

const userHeaders = {   
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};
export const getImages = () => {
    const images = fetch(`http://${BASE_URL}images`, { headers: userHeaders })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return images;
}

export const createImage = (formData: FormData) => {
  const img = fetch(`http://${BASE_URL}images`, {
      headers: userHeaders,
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
      .then((result) => {
        console.log('Result:', result);
        if (result.error) {
          console.error('Error:', result.error);
          return result;
        } else {
          return result;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        return error;
      });
  return img;
}


