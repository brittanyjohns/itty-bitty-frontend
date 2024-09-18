import { Image } from "./images";
import { BASE_URL, userHeaders } from "./constants";
export interface ChildBoard {
  id?: string;
  name: string;
  description?: string;
  predefined?: boolean;
  parent_type?: string;
  display_image_url?: string | null;
  number_of_columns: number;
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
  large_screen_columns: number;
  medium_screen_columns: number;
  small_screen_columns: number;
  word_list?: string[];
  bg_color?: string;
  margin_settings?: any;
}

const signedInToken =
  localStorage.getItem("token") || localStorage.getItem("child_token");

export const signedInHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${signedInToken}`,
};

export const getChildBoards = (
  childAccountId: number
): Promise<ChildBoard[]> => {
  const boards = fetch(`${BASE_URL}child_boards/${childAccountId}`, {
    headers: signedInHeaders,
  }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

export const getChildBoard = (id: number) => {
  const board = fetch(`${BASE_URL}child_boards/${id}`, {
    headers: signedInHeaders,
  }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return board;
};

export const childAccountHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("child_token")}`,
};

export const getCurrentChildBoards = (): Promise<ChildBoard[]> => {
  const boards = fetch(`${BASE_URL}child_boards/current`, {
    headers: childAccountHeaders,
  }) // `localhostboards
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return boards;
};

export const deleteChildBoard = (id: string) => {
  return fetch(`${BASE_URL}child_boards/${id}`, {
    method: "DELETE",
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error deleting board: ", error));
};
