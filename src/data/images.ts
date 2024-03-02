export interface Image {
    id: string; // Assuming each image has a unique ID for key purposes
    src: string;
    label: string;
    audio?: string; // Make audio optional
  }
  
  export interface ImageGalleryProps {
    boardId?: string | null;
    images: Image[];
  }

  export interface SelectImageGalleryProps {
    boardId: string;
    images: Image[];
    page: number;
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

const createHeaders = {
    // 'Content-Type': 'multipart/form-data',
    'Authorization':`Bearer ${localStorage.getItem('token')}`
  };

export const createImage = (formData: FormData, boardId?: string) => {
  let endpoint = `http://${BASE_URL}images`;
  if(boardId) {
    formData.append('image[board_id]', boardId);
    endpoint = `http://${BASE_URL}boards/${boardId}/add_image`;
  }

  for(var pair of formData.entries()) {
    console.log("create Image Pair", pair[0]+', '+pair[1]);
}
  const img = fetch(endpoint, {
      headers: createHeaders,
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
      .then((result) => {
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


export const getImage = (id: string) => {
    const image = fetch(`http://${BASE_URL}images/${id}`, { headers: userHeaders })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return image;
}

export const updateImage = (formData: FormData) => {
    const img = fetch(`http://${BASE_URL}images/${formData.get('image[id]')}`, {
        headers: createHeaders,
        method: 'PUT',
        body: formData,
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error updating image: ', error));

    return img;
}
