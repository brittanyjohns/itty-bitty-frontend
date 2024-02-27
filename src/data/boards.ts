import { Image } from './images';

export interface Board {
    id?: number;
    name: string;
    displayImage?: string;
    images?: Image[];
}

// const BASE_URL = '10.0.2.2'; // For Android emulator
const BASE_URL = 'localhost'; // For web development

export const getBoards = () => {
    const boards = fetch(`http://${BASE_URL}:3000/api/boards`) // `http://localhost:3000/api/boards
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return boards;
}

export const getBoard = (id: number) => {
    const board = fetch(`http://${BASE_URL}:3000/api/boards/${id}`) // `http://localhost:3000/api/boards
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return board;
}

export const createBoard = (board: Board) => {
    const newBoard = fetch(`http://${BASE_URL}:3000/api/boards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(board),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error creating board: ', error));

    return newBoard;
}

export const updateBoard = (board: Board) => {
    const updatedBoard = fetch(`http://${BASE_URL}:3000/api/boards/${board.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(board),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error updating board: ', error));

    return updatedBoard;
}