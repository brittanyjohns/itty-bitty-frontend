import { Board } from "./boards";
import { User } from "./users";
import { userHeaders, BASE_URL, childAccountHeaders } from "./constants";

export interface ChildAccount {
  id?: number;
  user_id: number;
  username: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  user?: User;
  errors?: string[];
  password?: string;
  password_confirmation?: string;
  boards?: Board[];
  settings?: any; // TODO: Define Settings interface
  error?: string;
  parent_name?: string;
  passcode?: string;
}

export async function createChildAccount(
  payload: ChildAccount
): Promise<ChildAccount> {
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify(payload),
  };
  const response = await fetch(
    `${BASE_URL}users/${payload.user_id}/child_accounts`,
    requestInfo
  );
  const result = await response.json();
  return result;
}

export async function updateChildAccount(
  payload: ChildAccount
): Promise<ChildAccount> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify(payload),
  };
  const response = await fetch(
    `${BASE_URL}users/${payload.user_id}/child_accounts/${payload.id}`,
    requestInfo
  );
  const result = await response.json();
  return result;
}

export const getChildAccounts = async (
  userId: number
): Promise<ChildAccount[]> => {
  const requestInfo = {
    method: "GET",
    headers: userHeaders,
  };
  const response = await fetch(
    `${BASE_URL}users/${userId}/child_accounts`,
    requestInfo
  );
  const result = await response.json();
  return result;
};

export const getChildAccount = async (
  id: number,
  userId: number
): Promise<ChildAccount> => {
  const requestInfo = {
    method: "GET",
    headers: userHeaders,
  };
  const response = await fetch(
    `${BASE_URL}users/${userId}/child_accounts/${id}`,
    requestInfo
  );
  const result = await response.json();
  // console.log("getChildAccount result", result);
  return result;
};

export const assignBoardToChildAccount = async (
  userId: number,
  childAccountId: number,
  boardId: number
): Promise<ChildAccount> => {
  console.log("assignBoardToChildAccount", userId, childAccountId, boardId);
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify({
      board_id: boardId,
      child_account_id: childAccountId,
    }),
  };
  const response = await fetch(
    `${BASE_URL}users/${userId}/child_accounts/${childAccountId}/assign_board`,
    requestInfo
  );
  const result = await response.json();
  return result;
};

export const signIn = (child_account: ChildAccount) => {
  console.log("signIn", child_account);
  const response = fetch(`${BASE_URL}v1/child_accounts/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(child_account),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error signing in: ", error));

  return response;
};

export const getCurrentAccount = async (): Promise<ChildAccount> => {
  const token = localStorage.getItem("child_token");
  if (!token) {
    return { error: "No account token found", user_id: 0, username: "" };
  }
  const response = await fetch(`${BASE_URL}v1/child_accounts/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  return result["child"];
};

export const isAccountSignedIn = (): boolean => {
  const token = localStorage.getItem("child_token");
  return token != null;
};

export const signOut = async (): Promise<any> => {
  const token = localStorage.getItem("child_token");
  if (!token) {
    return { error: "No token found" };
  }
  const response = await fetch(`${BASE_URL}v1/child_accounts/logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  return result;
};

export const getChildBoards = async (
  childAccountId: number
): Promise<Board[]> => {
  const requestInfo = {
    method: "GET",
    headers: childAccountHeaders,
  };
  const response = await fetch(
    `${BASE_URL}child_accounts/${childAccountId}/boards`,
    requestInfo
  );
  const result = await response.json();
  return result;
};
