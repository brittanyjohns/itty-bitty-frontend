export const BASE_URL = 'localhost'; // For web development
export interface NewUser {
    email: string;
    password: string;
    password_confirmation: string;
}
export interface User {
    id?: number;
    email: string;
    password: string;
}
export const signIn = (user: User) => {
    const response = fetch(`http://${BASE_URL}:4000/login`, {
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
    const response = fetch(`http://${BASE_URL}:4000/api/v1/users`, {
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
    localStorage.removeItem('token');
    console.log('User signed out');
}

export const isUserSignedIn = () => {
    return localStorage.getItem('token') !== null;
}

export const getCurrentUser = () => {
    return localStorage.getItem('token');
}