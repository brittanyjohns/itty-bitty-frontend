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

export const getBoardImage = async (id: string): Promise<BoardImage> => {
  const response = await fetch(`${BASE_URL}board_images/${id}`, {
    headers: userHeaders,
  });
  const boardImage: BoardImage = await response.json();
  return boardImage;
};

export const switchBoardImageMode = async (id: string) => {
  const response = await fetch(`${BASE_URL}board_images/${id}/switch_mode`, {
    headers: userHeaders,
    method: "PUT",
  });
  return response.json();
};

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
  nextWords?: string[],
  run_job?: boolean
): Promise<BoardImage> {
  const response = await fetch(
    `${BASE_URL}board_images/${boardImageId}/set_next_words`,
    {
      headers: userHeaders,
      body: JSON.stringify({ next_words: nextWords, run_job }),
      method: "POST",
    }
  );
  const boardImage: BoardImage = await response.json();
  return boardImage;
}

export async function getPredictiveBoardImages(
  boardImageId: string
): Promise<any> {
  if (!boardImageId) {
    throw new Error("No board image id provided");
  }
  const response = await fetch(
    `${BASE_URL}board_images/${boardImageId}/predictive_images`,
    { headers: userHeaders }
  );
  const board: any = await response.json();
  return board;
}

export const makeDynamicBoard = async (
  boardImageId: string,
  imageType?: string
) => {
  if (!boardImageId) {
    throw new Error("No board image id provided");
  }
  let endpoint = `${BASE_URL}board_images/${boardImageId}/make_dynamic`;
  if (imageType === "image") {
    endpoint = `${BASE_URL}images/${boardImageId}/make_dynamic`;
  }
  const response = await fetch(endpoint, {
    headers: userHeaders,
    method: "POST",
  });
  const board: any = await response.json();
  return board;
};
