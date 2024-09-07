import { BASE_URL, userHeaders } from "./constants";

export const getDynamicBoards = async () => {
  const response = await fetch(`${BASE_URL}dynamic_boards`, {
    headers: userHeaders,
  });
  return response.json();
};

export const getDynamicBoard = async (id: string) => {
  const response = await fetch(`${BASE_URL}dynamic_boards/${id}`, {
    headers: userHeaders,
  });
  return response.json();
};
