import { Board } from "./boards";
import { userHeaders, BASE_URL } from "./users";

interface WordClickPayload {
    word: string;
    timestamp: string;
    previousWord?: string;
    boardId?: string;
}

export async function clickWord(payload: WordClickPayload): Promise<any> {
    console.log('clickWord', payload);
    const requestInfo = {
        method: "POST",
        headers: userHeaders,
        body: JSON.stringify(payload),
    };
    const response = await fetch(`${BASE_URL}word_click`, requestInfo);
    const result = await response.json();
    console.log('clickWord', result);
    return result;
}