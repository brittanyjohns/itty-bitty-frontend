// google_images

import { userHeaders, BASE_URL } from "./constants";
import { Image } from "./images";
export interface ImageResult {
  link: string;
  title: string;
  thumbnail: string;
  snippet?: string;
  context?: string;
  fileFormat?: string;
}
export const imageSearch = async (search: string): Promise<any> => {
  const requestInfo = {
    method: "GET",
    headers: userHeaders,
  };
  const response = await fetch(
    `${BASE_URL}google_images?q=${search}`,
    requestInfo
  );
  const result = await response.json();
  return result;
};

export const saveImageResult = async (
  imageResult: ImageResult,
  query: string
): Promise<Image> => {
  const response = await fetch(`${BASE_URL}save_image_result`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ imageResult, query }),
  });
  const newImage: Image = await response.json();
  console.log("New Image: ", newImage);
  return newImage;
};
