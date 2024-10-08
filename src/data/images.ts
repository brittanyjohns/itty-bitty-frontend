import { Layout } from "react-grid-layout";
import { Board } from "./boards";
import { BASE_URL, userHeaders } from "./constants";
import { ImageResult } from "./search";
export interface ImageDoc {
  id: string;
  src: string;
  label: string;
  is_current?: boolean;
  raw?: string;
  user_id?: string;
  can_edit?: boolean;
}

export interface Image {
  id: string;
  user_id?: string;
  src: string | null;
  audio_url: string | null;
  label: string;
  image_prompt?: string;
  audio?: string;
  docs?: ImageDoc[];
  display_doc?: ImageDoc;
  bg_color: string;
  image_type?: string;
  text_color?: string;
  position?: number;
  layout?: DraggableGridLayout[];
  next_board_id?: string;
  nextImageSrcs?: string[];
  next_words?: string[];
  no_next?: boolean;
  user_next_words?: string[];
  is_placeholder?: boolean;
  user_boards?: Board[];
  remaining_boards?: Board[];
  status?: string;
  error?: string;
  part_of_speech?: string;
  added_at?: string;
  image_last_added_at?: string;
  open_symbol_api_status?: string;
  user?: any;
  created_at?: string;
  updated_at?: string;
  audio_files?: any[];
  custom_audio_files?: any[];
  can_edit?: boolean;
}

export interface DraggableGridLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// export interface Image {
//   id: string;
//   src: string;
//   label: string;
//   next_board_id: string;
//   nextImageSrcs: string[];
//   next_words: string[]
//   image_prompt?: string;
//   audio?: string;
//   docs?: ImageDoc[];
//   display_doc?: ImageDoc;
//   bg_color: string;
// }

export interface PredictiveImageGalleryProps {
  predictiveImages: Image[];
  boardId: string;
  onImageClick: any;
}

export interface ImageGalleryProps {
  boardId?: string | null;
  board?: Board;
  images: Image[];
  setShowIcon: any;
  inputRef: any;
  gridSize?: number;
}

export interface SelectImageGalleryProps {
  boardId?: string;
  images: Image[];
  onLoadMoreImages: any;
  onImageClick: any;
  searchInput: string;
  segmentType?: string;
  fetchUserBoards?: any;
}

export const getImages = () => {
  const images = fetch(`${BASE_URL}images`, { headers: userHeaders })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return images;
};

const createHeaders = {
  // 'Content-Type': 'multipart/form-data',
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const createImage = (formData: FormData, boardId?: string) => {
  let endpoint = `${BASE_URL}images`;
  if (boardId) {
    formData.append("image[board_id]", boardId);
    endpoint = `${BASE_URL}boards/${boardId}/add_image`;
  }

  for (var pair of formData.entries()) {
    console.log("create Image Pair", pair[0] + ", " + pair[1]);
  }
  const img = fetch(endpoint, {
    headers: createHeaders,
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        console.error("Error:", result.error);
        return result;
      } else {
        return result;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return img;
};

export const getImage = (id: string) => {
  const image = fetch(`${BASE_URL}images/${id}`, { headers: userHeaders })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return image;
};

export const cropImage = (formData: FormData) => {
  const imageId = formData.get("image[id]");
  const label = formData.get("image[label]");
  const img = fetch(`${BASE_URL}images/crop`, {
    headers: createHeaders,
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error cropping image: ", error));

  return img;
};

export const updateImage = (formData: FormData) => {
  const img = fetch(`${BASE_URL}images/${formData.get("image[id]")}`, {
    headers: createHeaders,
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating image: ", error));

  return img;
};

export const uploadAudioFile = (imageId: string, formData: FormData) => {
  const img = fetch(`${BASE_URL}images/${imageId}/upload_audio`, {
    headers: createHeaders,
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error uploading audio file: ", error));

  return img;
};

export const setCurrentAudio = (imageId: string, formData: FormData) => {
  const audioFileId = formData.get("audio_file_id");
  if (!audioFileId) {
    console.error("No audio file id provided");
    return;
  }
  console.log("Setting current audio", imageId, audioFileId);
  const img = fetch(`${BASE_URL}images/${imageId}/set_current_audio`, {
    headers: createHeaders,
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error setting current audio: ", error));

  return img;
};

export async function getMoreImages(
  page: number,
  query: string,
  userOnly: boolean
): Promise<Image[]> {
  const response = await fetch(
    `${BASE_URL}images?page=${page}&query=${query}&user_only=${
      userOnly ? "1" : "0"
    }`,
    { headers: userHeaders }
  );
  const images: Image[] = await response.json();
  return images;
}

export async function getUserImages(): Promise<Image[]> {
  const response = await fetch(`${BASE_URL}images/user_images`, {
    headers: userHeaders,
  });
  const images: Image[] = await response.json();
  return images;
}
export async function getPredictiveImages(imageId: string): Promise<Image[]> {
  if (!imageId) {
    return [];
  }
  const response = await fetch(
    `${BASE_URL}boards/${imageId}/predictive_images`,
    { headers: userHeaders }
  );
  const images: Image[] = await response.json();
  return images;
}

export async function findOrCreateImage(
  formData: FormData,
  generate: boolean
): Promise<Image> {
  formData.append("generate_image", generate ? "1" : "0");
  const response = await fetch(`${BASE_URL}images/find_or_create`, {
    headers: createHeaders,
    method: "POST",
    body: formData,
  });
  const image: Image = await response.json();
  return image;
}

export async function generateImage(formData: FormData): Promise<Image> {
  const response = await fetch(`${BASE_URL}images/generate`, {
    headers: createHeaders,
    method: "POST",
    body: formData,
  });
  const image: Image = await response.json();
  return image;
}

export async function getPredictiveImagesByIds(
  ids: string[]
): Promise<Image[]> {
  const response = await fetch(
    `${BASE_URL}images/predictive?ids=${ids.join(",")}`,
    { headers: userHeaders }
  );
  const images: Image[] = await response.json();
  return images;
}

export async function deleteImage(id: string): Promise<any> {
  const response = await fetch(`${BASE_URL}images/${id}`, {
    headers: userHeaders,
    method: "DELETE",
  });
  return response.json();
}

export async function addDoc(
  imageId: string,
  formData: FormData
): Promise<any> {
  const response = await fetch(`${BASE_URL}images/${imageId}/add_doc`, {
    headers: createHeaders,
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function removeDoc(
  imageId: string,
  docId: string | undefined
): Promise<any> {
  const response = await fetch(`${BASE_URL}images/${imageId}/hide_doc`, {
    headers: userHeaders,
    body: JSON.stringify({ doc_id: docId }),
    method: "POST",
  });
  return response.json();
}

export async function setNextWords(
  imageId: string,
  nextWords?: string[]
): Promise<any> {
  const response = await fetch(`${BASE_URL}images/${imageId}/set_next_words`, {
    headers: userHeaders,
    body: JSON.stringify({ next_words: nextWords }),
    method: "POST",
  });
  return response.json();
}

export async function create_symbol(imageId: string): Promise<any> {
  const response = await fetch(`${BASE_URL}images/${imageId}/create_symbol`, {
    headers: userHeaders,
    method: "POST",
  });
  return response.json();
}

export async function getSampleVoices(): Promise<any> {
  const response = await fetch(`${BASE_URL}sample_voices`, {
    headers: userHeaders,
    method: "GET",
  });
  return response.json();
}

export async function cloneImage(
  imageId: string,
  newName?: string
): Promise<Image> {
  newName;
  const response = await fetch(
    `${BASE_URL}images/${imageId}/clone?new_name=${newName}`,
    {
      headers: userHeaders,
      method: "POST",
    }
  );
  return response.json();
}

export async function findByLabel(label: string): Promise<Image> {
  const response = await fetch(
    `${BASE_URL}images/find_by_label?label=${label}`,
    {
      headers: userHeaders,
      method: "GET",
    }
  );
  return response.json();
}

export const deleteAudioFile = async (
  image_id: string,
  audio_file_id: string
) => {
  const response = await fetch(
    `${BASE_URL}images/${image_id}/destroy_audio?audio_file_id=${audio_file_id}`,
    {
      headers: userHeaders,
      method: "DELETE",
    }
  );
  return response.json();
};

export const createAudio = async (id: string, voice: string) => {
  const response = await fetch(`${BASE_URL}images/${id}/create_audio`, {
    headers: userHeaders,
    method: "POST",
    body: JSON.stringify({ voice }),
  });
  return response.json();
};

export const saveTempDoc = async (
  imageUrl: string,
  query: string,
  imageId?: string
) => {
  const response = await fetch(`${BASE_URL}images/save_temp_doc`, {
    headers: userHeaders,
    method: "POST",
    body: JSON.stringify({ imageUrl, query, imageId }),
  });
  return response.json();
};
