import { Board } from "./boards";
import { BASE_URL } from "./users";
  export interface ImageDoc {
    id: string;
    src: string;
    label: string;
    is_current?: boolean;
  }
  
  export interface Image {
    id: string;
    src: string;
    label: string;
    image_prompt?: string;
    audio?: string;
    docs?: ImageDoc[];
    display_doc?: ImageDoc;
  }

  export interface PredictiveImage {
    id: string;
    src: string;
    label: string;
    next_board_id: string;
    nextImageIds: string[];
    next_words: string[]
    image_prompt?: string;
    audio?: string;
    docs?: ImageDoc[];
    display_doc?: ImageDoc;
  }

  export interface PredictiveImageGalleryProps {
    predictiveImages: PredictiveImage[];
    boardId: string;
    onImageClick: any;
  }
  
  export interface ImageGalleryProps {
    boardId?: string | null;
    board?: Board
    images: Image[];
    setShowIcon: any;
    inputRef: any;
  }
  // (boardId, {
  //           query: query,
  //           page: page
  //       });

  export interface SelectImageGalleryProps {
    boardId?: string;
    images: Image[];
    onLoadMoreImages: any;
    onImageClick: any;
    searchInput: string;
  }

const userHeaders = {   
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};
export const getImages = () => {
  const userToken = localStorage.getItem('token');
  console.log('userToken', userToken);
    const images = fetch(`${BASE_URL}images`, { headers: userHeaders })
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
  let endpoint = `${BASE_URL}images`;
  if(boardId) {
    formData.append('image[board_id]', boardId);
    endpoint = `${BASE_URL}boards/${boardId}/add_image`;
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
    const image = fetch(`${BASE_URL}images/${id}`, { headers: userHeaders })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return image;
}

export const updateImage = (formData: FormData) => {
    const img = fetch(`${BASE_URL}images/${formData.get('image[id]')}`, {
        headers: createHeaders,
        method: 'PUT',
        body: formData,
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error updating image: ', error));

    return img;
}

export async function getMoreImages(page: number, query: string): Promise<Image[]> {
  const response = await fetch(`${BASE_URL}images?page=${page}&query=${query}`,
   { headers: userHeaders }) 
  const images: Image[] = await response.json();
  return images;
}

export async function getPredictiveImages(boardId: string): Promise<PredictiveImage[]> {
  console.log('getPredictiveImages boardId', boardId);
  if (!boardId) {
    return [];
  }
  const response = await fetch(`${BASE_URL}boards/${boardId}/predictive_images`, { headers: userHeaders });
  const images: PredictiveImage[] = await response.json();
  return images;
}

export async function findOrCreateImage(formData: FormData, generate: boolean): Promise<Image> {
  formData.append('generate_image', generate ? '1' : '0');
  const response = await fetch(`${BASE_URL}images/find_or_create`, {
    headers: createHeaders,
    method: 'POST',
    body: formData,
  });
  const image: Image = await response.json();
  return image;
}

export async function generateImage(formData: FormData): Promise<Image> {
  const response = await fetch(`${BASE_URL}images/generate`, {
    headers: createHeaders,
    method: 'POST',
    body: formData,
  });
  const image: Image = await response.json();
  return image;
}