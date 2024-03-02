import { Image } from './images';
import { BASE_URL, userHeaders } from './users';

export interface Board {
    id?: string;
    name: string;
    displayImage?: string;
    images?: Image[];
}

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
        headers: userHeaders,
        body: JSON.stringify(board),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error updating board: ', error));

    return updatedBoard;
}

export const deleteBoard = (id: string) => {
    const result = fetch(`http://${BASE_URL}boards/${id}`, {
        method: 'DELETE',
        headers: userHeaders,
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error deleting board: ', error));

    return result;
}

export async function addImageListToBoard(id: string, payload: { word_list: string[] }): Promise<Board> {
    const requestInfo = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`http://${BASE_URL}boards/${id}/add_word_list`, requestInfo);
    const board: Board = await response.json();
    return board;
  }

  export interface RemainingImageProps {
    page: number | null;
    query: string | null;
  }

  export async function getRemainingImages(id: string, props: RemainingImageProps): Promise<Image[]> {
    const response = await fetch(`http://${BASE_URL}boards/${id}/remaining_images?page=${props.page}&query=${props.query}`,
     { headers: userHeaders }) 
    const images: Image[] = await response.json();
    return images;
  }

  export async function addImageToBoard(id: string, image_id: string): Promise<Board> {
    const requestInfo = {
      method: "PUT",
      headers: userHeaders,
      body: JSON.stringify({ image_id }),
    };
    const response = await fetch(`http://${BASE_URL}boards/${id}/associate_image`, requestInfo);
    console.log("Add Image to Board response", response);
    const board: Board = await response.json();
    console.log("Add Image to Board board", board);
    return board;
  }

  export async function removeImageFromBoard(id: string, image_id: string): Promise<Board> {
    const body = JSON.stringify({ image_id });
    console.log("Remove Image from Board body", body);
    const requestInfo = {
      method: "POST",
      headers: userHeaders,
      body: body,
    };
    const response = await fetch(`http://${BASE_URL}boards/${id}/remove_image`, requestInfo);
    console.log("Remove Image from Board response", response);
    const board: Board = await response.json();
    return board;
  }