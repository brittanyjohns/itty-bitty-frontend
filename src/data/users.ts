import { BASE_URL, userHeaders } from "./constants";
export interface NewUser {
  email: string;
  password: string;
  password_confirmation: string;
  plan?: string;
}
export interface User {
  id?: number;
  uuid?: string;
  email: string;
  password?: string;
  name?: string;
  tokens?: number;
  role?: string;
  settings?: UserSetting;
  created_at?: string;
  updated_at?: string;
  platforms?: string[];
  isDesktop?: boolean;
  errors?: string[];
  plan_type?: string;
  plan_status?: string;
  plan_expires_at?: string;
  total_plan_cost?: number;
  monthly_price?: number;
  yearly_price?: number;
  stripe_customer_id?: string;
  admin?: boolean;
  free?: boolean;
  pro?: boolean;
  team?: any; // TODO: Define Team interface
  team_id?: number;
  boards?: any[]; // TODO: Define Board interface
  starting_board_id?: number;
  child_accounts?: any[]; // TODO: Define ChildAccount interface
  free_trial?: boolean;
  trial_days_left?: number;
  trial_expired?: boolean;
  dynamic_board_id?: number;
}
export interface VoiceSetting {
  name?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export interface UserSetting {
  voice?: VoiceSetting;
  wait_to_speak?: boolean;
  disable_audit_logging?: boolean;
  [key: string]: any; // Index signature for dynamic keys
}

export const signIn = (user: User) => {
  const response = fetch(`${BASE_URL}v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error signing in: ", error));

  return response;
};

export const signUp = (user: User) => {
  const response = fetch(`${BASE_URL}v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error signing up: ", error));

  return response;
};

export const signOut = () => {
  const response = fetch(`${BASE_URL}v1/users/sign_out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  localStorage.removeItem("token");
  return response;
};

export const forgotPassword = (email: string) => {
  const response = fetch(`${BASE_URL}v1/forgot_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error resetting password: ", error));

  return response;
};

export const resetPassword = (
  reset_password_token: string,
  password: string,
  password_confirmation: string
) => {
  const response = fetch(`${BASE_URL}v1/reset_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reset_password_token,
      password,
      password_confirmation,
    }),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error resetting password: ", error));

  return response;
};

export const isUserSignedIn = () => {
  const token = localStorage.getItem("token");
  return token != null;
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}v1/users/current`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    const currentTime = new Date().getTime();
    if (response.ok) {
      return data.user; // Assuming the response structure is { user: currentUser }
    } else {
      return null; // Handle unauthorized or other errors gracefully
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const updateUser = (user: User, userId?: number) => {
  const endpoint = `${BASE_URL}users/${userId}`;

  const userSetting = fetch(endpoint, {
    headers: userHeaders,
    method: "PUT",
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        console.error("Error:", result.error);
        return result;
      } else {
        return result;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return userSetting;
};

export const updateUserSettings = (
  userSetting: UserSetting,
  userId?: string
) => {
  const endpoint = `${BASE_URL}users/${userId}/update_settings`;

  const userSettingRequest = fetch(endpoint, {
    headers: userHeaders,
    method: "PUT",
    body: JSON.stringify(userSetting),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        console.error("Error:", result.error);
        return result;
      } else {
        return result;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return userSettingRequest;
};

export const classNameForInput = (currentUser: User | null) => {
  if (!currentUser) {
    return "";
  }
  let x = `${denyAccess(currentUser) ? "text-red-700 " : ""} `;
  x += currentUser?.free_trial ? "text-red-700" : "";

  return x;
};

export const denyAccess = (currentUser: User | null) => {
  if (!currentUser) {
    return true;
  }

  if (currentUser?.admin || currentUser?.pro) {
    return false;
  }
  if (
    currentUser?.trial_days_left != undefined &&
    currentUser?.trial_days_left <= 0
  ) {
    return true;
  }
  return false;
};
