import { BASE_URL, userHeaders } from "./constants";
export interface WordEvent {
  id: number;
  user_id: number;
  word: string;
  previous_word: string | null;
  timestamp: string;
}

export const fetchWordEvents = async () => {
  const response = await fetch(`${BASE_URL}word_events`, {
    headers: userHeaders,
  });
  const data: WordEvent[] = await response.json();
  return data;
};

export const fetchWordEventsByUserId = async (userId: number) => {
  const response = await fetch(`${BASE_URL}word_events?user_id=${userId}`, {
    headers: userHeaders,
  });
  const data: WordEvent[] = await response.json();
  return data;
};
