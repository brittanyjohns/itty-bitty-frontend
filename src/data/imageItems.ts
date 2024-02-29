import { NewImageItemPayload, ImageItem, API_URL } from "../types";
export async function getImages(): Promise<ImageItem[]> {
  const requestInfo = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(`${API_URL}images`, requestInfo);
  const images: ImageItem[] = await response.json();
  console.log("API");
  console.log(images);
  return images;
}

export async function getImage(id: string): Promise<ImageItem> {
  const requestInfo = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(`${API_URL}images/${id}`, requestInfo);
  const image: ImageItem = await response.json();
  return image;
}

export async function createImage(payload: NewImageItemPayload): Promise<ImageItem> {
  const requestInfo = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const response = await fetch(API_URL + "images", requestInfo);
  const image: ImageItem = await response.json();
  return image;
}

export async function deleteImage(id: string): Promise<void> {
  const requestInfo = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(`${API_URL}images/${id}`, requestInfo);
}

export async function updateImage(id: string, payload: NewImageItemPayload): Promise<ImageItem> {
  const requestInfo = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const response = await fetch(`${API_URL}images/${id}`, requestInfo);
  const image: ImageItem = await response.json();
  return image;
}

export async function getImagesByCategory(category: string): Promise<ImageItem[]> {
  const requestInfo = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(`${API_URL}images/category/${category}`, requestInfo);
  const images: ImageItem[] = await response.json();
  return images;
}
