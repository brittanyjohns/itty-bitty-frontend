import { Image } from './images';

export interface Board {
    id?: number;
    name: string;
    displayImage?: string;
    images?: Image[];
}

// const BASE_URL = '10.0.2.2'; // For Android emulator
const BASE_URL = 'localhost:4000/api/'; // For web development
const userHeaders = {   
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};
export const getBoards = () => {
    const boards = fetch(`http://${BASE_URL}boards`, { headers: userHeaders }) // `http://localhostboards
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return boards;
}

export const getBoard = (id: number) => {
    const board = fetch(`http://${BASE_URL}boards/${id}`, { headers: userHeaders }) // `http://localhostboards
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return board;
}

export const createBoard = (board: Board) => {
    const newBoard = fetch(`http://${BASE_URL}boards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(board),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error creating board: ', error));

    return newBoard;
}

export const updateBoard = (board: Board) => {
    const updatedBoard = fetch(`http://${BASE_URL}boards/${board.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(board),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error updating board: ', error));

    return updatedBoard;
}

export async function addImageListToBoard(id: string, payload: { word_list: string[] }): Promise<Board> {
    const requestInfo = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${BASE_URL}boards/${id}/add_word_list`, requestInfo);
    const board: Board = await response.json();
    return board;
  }