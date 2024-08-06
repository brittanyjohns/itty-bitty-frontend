import { Board } from "./boards";
import { BASE_URL, userHeaders } from "./constants";

export interface BoardGroup {
  id: string;
  name: string;
  boards?: Board[];
  boardIds?: string[];
  predefined: boolean;
  display_image_url?: string | null;
  audio_url?: string;
  layout?: any;
  created_at?: string;
  updated_at?: string;
  bg_color?: string;
  number_of_columns?: number;
}

export async function getBoardGroups(): Promise<BoardGroup[]> {
  const response = await fetch(`${BASE_URL}board_groups`, {
    headers: userHeaders,
  });
  const boardGroups: BoardGroup[] = await response.json();
  return boardGroups;
}

export async function createBoardGroup(
  name: string,
  boardIds: string[]
): Promise<BoardGroup> {
  const response = await fetch(`${BASE_URL}board_groups`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ board_group: { name, board_ids: boardIds } }),
  });
  const boardGroup: BoardGroup = await response.json();
  return boardGroup;
}

export async function getBoardGroup(id: string): Promise<BoardGroup> {
  const response = await fetch(`${BASE_URL}board_groups/${id}`, {
    headers: userHeaders,
  });
  const boardGroup: BoardGroup = await response.json();
  return boardGroup;
}

export async function deleteBoardGroup(id: string): Promise<any> {
  const response = await fetch(`${BASE_URL}board_groups/${id}`, {
    method: "DELETE",
    headers: userHeaders,
  });
  return response.json();
}

export async function updateBoardGroup(
  boardGroup: BoardGroup
): Promise<BoardGroup> {
  const { id, name, display_image_url, audio_url, bg_color, boardIds } =
    boardGroup;
  console.log("updating boardGroup: ", boardGroup);
  const payload = {
    name,
    display_image_url,
    audio_url,
    bg_color,
    board_ids: boardIds,
    number_of_columns: boardGroup.number_of_columns,
    predefined: boardGroup.predefined,
  };
  const response = await fetch(`${BASE_URL}board_groups/${id}`, {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ board_group: payload }),
  });
  const updatedBoardGroup: BoardGroup = await response.json();
  return updatedBoardGroup;
}

export async function addBoardToGroup(
  boardGroupId: string,
  boardId: string
): Promise<BoardGroup> {
  const response = await fetch(
    `${BASE_URL}board_groups/${boardGroupId}/add_board/${boardId}`,
    {
      method: "POST",
      headers: userHeaders,
    }
  );
  const boardGroup: BoardGroup = await response.json();
  return boardGroup;
}

export async function removeBoardFromGroup(
  boardGroupId: string,
  boardId: string
): Promise<BoardGroup> {
  const response = await fetch(
    `${BASE_URL}board_groups/${boardGroupId}/remove_board/${boardId}`,
    {
      method: "POST",
      headers: userHeaders,
    }
  );
  const boardGroup: BoardGroup = await response.json();
  return boardGroup;
}

export async function rearrangeBoards(boardGroupId: string): Promise<any> {
  const response = await fetch(
    `${BASE_URL}board_groups/${boardGroupId}/rearrange_boards`,
    {
      method: "POST",
      headers: userHeaders,
    }
  );
  return response.json();
}

export const saveLayout = (id: string, layout: any) => {
  const updatedBoardGroup = fetch(`${BASE_URL}board_groups/${id}/save_layout`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({ layout }),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating board: ", error));

  return updatedBoardGroup;
};
