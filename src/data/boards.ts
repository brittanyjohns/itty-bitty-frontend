import { Image } from "./images";
import { BASE_URL, userHeaders } from "./constants";
import { ChildBoard } from "./child_boards";
import { search } from "ionicons/icons";
export interface NewBoardPayload {
  id?: string;
  name: string;
  description?: string;
  number_of_columns?: number;
  word_list?: string[];
}

// interface BoardMarginSettings {
//   lg?: { x: number; y: number };
//   md?: { x: number; y: number };
//   sm?: { x: number; y: number };
// }

export interface Board {
  id: string;
  name: string;
  description?: string;
  predefined?: boolean;
  parent_type?: string;
  display_image_url?: string | null;
  number_of_columns?: number;
  small_screen_columns?: number;
  medium_screen_columns?: number;
  large_screen_columns?: number;
  images?: Image[];
  error?: string;
  floating_words?: string[];
  voice?: string;
  can_edit?: boolean;
  can_delete?: boolean;
  cost?: number;
  status?: string;
  token_limit?: number;
  has_generating_images?: boolean;
  user_id?: string;
  layout?: any;
  bg_color?: string;
  audio_url?: string;
  word_list?: string[];
  margin_settings: any;
  category?: string;
}

// export interface PredictiveBoard {
//   id: string;
//   name: string;
//   description: string;
//   number_of_columns: number;
//   images: Image[];
// }

export const getCategories = () => {
  const boards = fetch(`${BASE_URL}boards/categories`, { headers: userHeaders }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

export const getBoards = (
  searchTerm: string,
  page: number,
  userOnly?: boolean
) => {
  const boards = fetch(
    `${BASE_URL}boards?page=${page}&query=${searchTerm}&user_only=${
      userOnly ? "1" : "0"
    }`,
    { headers: userHeaders }
  ) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

export const getPresetBoards = (
  searchTerm: string,
  page: number,
  filter?: string
) => {
  const boards = fetch(
    `${BASE_URL}boards/preset?page=${page}&query=${searchTerm}&filter=${filter}`,
    { headers: userHeaders }
  ) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

export interface BoardMargins {
  xMargin: number;
  yMargin: number;
}

export const saveLayout = (
  id: string,
  layout: any,
  screen_size: string,
  { xMargin, yMargin }: BoardMargins
) => {
  const updatedBoard = fetch(`${BASE_URL}boards/${id}/save_layout`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ layout, screen_size, xMargin, yMargin }),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating board: ", error));

  return updatedBoard;
};

export const rearrangeImages = (id: string) => {
  const updatedBoard = fetch(`${BASE_URL}boards/${id}/rearrange_images`, {
    method: "POST",
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating board: ", error));

  return updatedBoard;
};

export const getUserBoards = () => {
  const boards = fetch(`${BASE_URL}boards/user_boards`, {
    headers: userHeaders,
  }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

export const getBoard = (id: string) => {
  const board = fetch(`${BASE_URL}boards/${id}`, { headers: userHeaders }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return board;
};

export const getInitialPredictive = (): Promise<Board> => {
  const board = fetch(`${BASE_URL}boards/first_predictive_board`, {
    headers: userHeaders,
  }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return board;
};

export async function createBoard(board: NewBoardPayload): Promise<Board> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify(board),
  };
  const response = await fetch(`${BASE_URL}boards`, requestInfo);
  const newBoard: Board = await response.json();
  return newBoard;
}

export const updateBoard = (board: Board | ChildBoard) => {
  const payload = {
    name: board.name,
    description: board.description,
    number_of_columns: board.number_of_columns,
    small_screen_columns: board.small_screen_columns,
    medium_screen_columns: board.medium_screen_columns,
    large_screen_columns: board.large_screen_columns,
    voice: board.voice,
    display_image_url: board.display_image_url,
    predefined: board.predefined,
    bg_color: board.bg_color,
    category: board.category,
  };
  const updatedBoard = fetch(`${BASE_URL}boards/${board.id}`, {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ board: payload, word_list: board.word_list }),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating board: ", error));

  return updatedBoard;
};

export const deleteBoard = (id: string) => {
  const result = fetch(`${BASE_URL}boards/${id}`, {
    method: "DELETE",
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error deleting board: ", error));

  return result;
};

export async function addImageListToBoard(
  id: string,
  payload: { word_list: string[] }
): Promise<Board> {
  const requestInfo = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/add_word_list`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function getRemainingImages(
  id: string,
  page: number,
  query: string
): Promise<Image[]> {
  let strPage = page.toString();
  if (query && query.length > 0) {
    strPage = "";
  }
  const response = await fetch(
    `${BASE_URL}boards/${id}/remaining_images?page=${strPage}&query=${query}`,
    { headers: userHeaders }
  );
  const images: Image[] = await response.json();
  return images;
}

export async function addImageToBoard(
  id: string,
  image_id: string
): Promise<any> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ image_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/associate_image`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function removeImageFromBoard(
  id: string,
  image_id: string
): Promise<Board> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ image_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/remove_image`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function addToTeam(id: string, team_id: string): Promise<any> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ team_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/add_to_team`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function removeFromTeam(
  id: string,
  team_id: string
): Promise<any> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ team_id }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/remove_from_team`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function cloneBoard(id: string): Promise<Board> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
  };
  const response = await fetch(`${BASE_URL}boards/${id}/clone`, requestInfo);
  const board: Board = await response.json();
  return board;
}

export async function createAdditionalImages(
  id: string,
  number: number
): Promise<any> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ num_of_words: number }),
  };
  const response = await fetch(
    `${BASE_URL}boards/${id}/create_additional_images`,
    requestInfo
  );
  const board: Board = await response.json();
  return board;
}

export async function getAdditionalWords(id: string, number: number) {
  const response = await fetch(
    `${BASE_URL}boards/${id}/additional_words?num_of_words=${number}`,
    {
      headers: userHeaders,
    }
  );
  const images: any = await response.json();
  return images;
}

export async function getWords(name: string, number: number) {
  const response = await fetch(
    `${BASE_URL}boards/words?name=${name}&num_of_words=${number}`,
    {
      headers: userHeaders,
    }
  );
  const words: any = await response.json();
  return words;
}
