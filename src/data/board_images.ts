import { Board } from "./boards";
import { BASE_URL, userHeaders } from "./constants";
import { Image } from "./images";
export interface BoardImage {
  id: string;
  label: string;
  image_url: string;
  audio_url: string;
  next_words: string[];
  mode: string;
  image?: Image;
  board_id: string;
  image_id: string;
  board: Board;
  board_name: string;
}
interface SpeakResponse {
  id: string;
  action: "speak";
  mode: string;
  label: string;
  audio_url: string;
}

interface DisplayNextWordsResponse {
  id: string;
  label: string;
  mode: string;
  action: "display_next_words";
  next_words: string[];
}

interface UnknownResponse {
  id: string;
  label?: string;
  mode?: string;
  action: "unknown";
}

export type BoardImageResponse =
  | SpeakResponse
  | DisplayNextWordsResponse
  | UnknownResponse;

export const getBoardImage = async (
  id: string
): Promise<BoardImageResponse> => {
  const response = await fetch(`${BASE_URL}board_images/${id}`, {
    headers: userHeaders,
  });
  const boardImage: BoardImageResponse = await response.json();
  return boardImage;
};

export const switchBoardImageMode = async (id: string) => {
  const response = await fetch(`${BASE_URL}board_images/${id}/switch_mode`, {
    headers: userHeaders,
    method: "PUT",
  });
  return response.json();
};

export async function getPredictiveBoardImages(
  boardImageId: string
): Promise<Image[]> {
  if (!boardImageId) {
    return [];
  }
  const response = await fetch(
    `${BASE_URL}board_images/${boardImageId}/predictive_images`,
    { headers: userHeaders }
  );
  const images: Image[] = await response.json();
  return images;
}

export const getBoardImagebyImageId = async (
  imageId: string,
  boardId: string
): Promise<BoardImage> => {
  const response = await fetch(
    `${BASE_URL}board_images/by_image?image_id=${imageId}&board_id=${boardId}`,
    {
      headers: userHeaders,
    }
  );
  const boardImage: BoardImage = await response.json();
  return boardImage;
};

export async function setNextBoardImageWords(
  boardImageId: string,
  nextWords?: string[]
): Promise<BoardImage> {
  const response = await fetch(
    `${BASE_URL}board_images/${boardImageId}/set_next_words`,
    {
      headers: userHeaders,
      body: JSON.stringify({ next_words: nextWords }),
      method: "POST",
    }
  );
  const boardImage: BoardImage = await response.json();
  return boardImage;
}
