import { userHeaders, BASE_URL } from "./constants";
export interface ImageResult {
  link: string;
  title: string;
  thumbnail: string;
  snippet?: string;
  context?: string;
  fileFormat?: string;
}
interface ImageSearchParams {
  q: string;
  fileType?: string;
  imgSize?: string;
  imgType?: string;
  safe?: string;
  searchType?: string;
  start?: number;
  num?: number;
}
export const imageSearch = async (
  search: string,
  params: ImageSearchParams
): Promise<any> => {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ search, ...params }),
  };
  const response = await fetch(
    `${BASE_URL}google_images?q=${search}`,
    requestInfo
  );
  const result = await response.json();
  return result;
};
