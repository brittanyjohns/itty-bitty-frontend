//export const BASE_URL = '10.0.2.2:4000/api/'; // For Android emulator
export const BASE_URL = 'localhost:4000/api/'; // For web development
// ionic capacitor run android -l --host=192.168.254.1

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
    email: string;
    password: string;
}
export const signIn = (user: User) => {
    const response = fetch(`http://${BASE_URL}v1/login`, {
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
    const response = fetch(`http://${BASE_URL}v1/users`, {
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
    const response = fetch(`http://${BASE_URL}v1/users/sign_out`, {
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

export const isUserSignedIn = () => {
    const token = localStorage.getItem('token')
    return token != null;
}

export const getCurrentUser = () => {
    const response = fetch(`http://${BASE_URL}v1/users/current`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));
    console.log('Current User', response);
    return response;
}