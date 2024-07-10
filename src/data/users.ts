//export const BASE_URL = '10.0.2.2:4000/api/'; // For Android emulator
// export const BASE_URL = 'localhost:4000/api/'; // For web development

import { useMediaQuery } from "react-responsive";

// ionic capacitor run android -l --host=192.168.254.1
const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

export const BASE_URL = API_URL ? API_URL + '/api/' : 'http://localhost:4000/api/'; // For web development
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
export const STRIPE_PRIVATE_KEY = import.meta.env.VITE_STRIPE_PRIVATE_KEY;
export const STRIPE_WEBHOOK_SECRET = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
export const STRIPE_PRICING_TABLE_ID = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;
export const STRIPE_PAYMENT_LINK_URL = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL;
export const STRIPE_CUSTOMER_PORTAL_URL = import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL;

export const userHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

export interface NewUser {
    email: string;
    password: string;
    password_confirmation: string;
}
export interface User {
    id?: number;
    uuid?: string;
    email?: string;
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
    id?: number;
    name?: string;
    voice: VoiceSetting;
    errors?: string[];
}
export const signIn = (user: User) => {
    const response = fetch(`${BASE_URL}v1/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error signing in: ', error));

    return response;
}

export const signUp = (user: User) => {
    const response = fetch(`${BASE_URL}v1/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error signing up: ', error));

    return response;
}

export const signOut = () => {
    const response = fetch(`${BASE_URL}v1/users/sign_out`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    })
    localStorage.removeItem('token');
    console.log('User signed out', response);
    return response;
}

export const forgotPassword = (email: string) => {
    const response = fetch(`${BASE_URL}v1/forgot_password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error resetting password: ', error));

    return response;
}

export const resetPassword = (reset_password_token: string, password: string, password_confirmation: string) => {
    console.log('resetPassword', reset_password_token)
    const response = fetch(`${BASE_URL}v1/reset_password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reset_password_token, password, password_confirmation }),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error resetting password: ', error));

    return response;
}

export const isUserSignedIn = () => {
    const token = localStorage.getItem('token')
    return token != null;
}

export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${BASE_URL}v1/users/current`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        const currentTime = new Date().getTime();
        console.log('Current User', data, currentTime);
        if (response.ok) {
            return data.user; // Assuming the response structure is { user: currentUser }
        } else {
            return null; // Handle unauthorized or other errors gracefully
        }
    } catch (error) {
        console.error('Error fetching data: ', error);
        return null;
    }
}

export const updatePlan = (plan: string, userId?: number) => {
    console.log('updatePlan', plan);
    console.log('userId', userId);
    const planJson = {
        plan_type: plan  
    }

    const endpoint = `${BASE_URL}users/${userId}/update_plan`;

    const userSetting = fetch(endpoint, {
        headers: userHeaders,
        method: 'PUT',
        body: JSON.stringify(planJson),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.error) {
                console.error('Error:', result.error);
                return result;
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            return error;
        });
    return userSetting;
}

export const updateUserSettings = (formData: FormData, userId?: string) => {
    console.log('updateUserSettings', formData);
    console.log('userId', userId);

  const endpoint = `${BASE_URL}users/${userId}/update_settings`;

  const userSetting = fetch(endpoint, {
      headers: userHeaders,
      method: 'PUT',
      body: JSON.stringify(formData),
    })
    .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.error('Error:', result.error);
          return result;
        } else {
          return result;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        return error;
      });
  return userSetting;
}