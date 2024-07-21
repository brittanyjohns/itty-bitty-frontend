import { body } from "ionicons/icons";
import { Board } from "./boards";
import { User } from "./users";
import { userHeaders, BASE_URL } from "./users";

export interface ChildAccount {
    id?: string;
    user_id: number;
    username: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
    user?: User;
    errors?: string[];
    password?: string;
    password_confirmation?: string;
    boards?: Board[]; // TODO: Define Board interface
    settings?: any; // TODO: Define Settings interface
    error?: string;
}

export async function createChildAccount(payload: ChildAccount): Promise<ChildAccount> {
    console.log('createChildAccount', payload);
    console.log('createChildAccount payload', payload);
    const requestInfo = {
        method: "POST",
        headers: userHeaders,
        body: JSON.stringify(payload),
    };
    const response = await fetch(`${BASE_URL}users/${payload.user_id}/child_accounts`, requestInfo);
    const result = await response.json();
    console.log('createChildAccount result', result);
    return result;
}

export const getChildAccounts = async (userId: number): Promise<ChildAccount[]> => {
    const requestInfo = {
        method: "GET",
        headers: userHeaders,
    };
    const response = await fetch(`${BASE_URL}users/${userId}/child_accounts`, requestInfo);
    const result = await response.json();
    return result;
}

export const getChildAccount = async (id: number, userId: number): Promise<ChildAccount> => {
    const requestInfo = {
        method: "GET",
        headers: userHeaders,
    };
    const response = await fetch(`${BASE_URL}users/${userId}/child_accounts/${id}`, requestInfo);
    const result = await response.json();
    console.log('getChildAccount result', result);
    return result;
}

export const assignBoardToChildAccount = async (userId: number, childAccountId: number, boardId: number): Promise<ChildAccount> => {
    console.log('assignBoardToChildAccount', userId, childAccountId, boardId);
    const requestInfo = {
        method: "POST",
        headers: userHeaders,
        body: JSON.stringify({ board_id: boardId, child_account_id: childAccountId }),
    };
    const response = await fetch(`${BASE_URL}users/${userId}/child_accounts/${childAccountId}/assign_board`, requestInfo);
    const result = await response.json();
    return result;
}