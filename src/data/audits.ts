import { userHeaders, BASE_URL } from "./constants";
import { signedInHeaders } from "./child_boards";

interface WordClickPayload {
  word: string;
  timestamp: string;
  previousWord?: string;
  boardId?: string;
}

export async function clickWord(payload: WordClickPayload): Promise<any> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify(payload),
  };
  const response = await fetch(`${BASE_URL}word_click`, requestInfo);
  const result = await response.json();
  return result;
}
