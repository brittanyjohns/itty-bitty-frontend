// const HOST_URL = process.env.REACT_APP_HOST_URL || "192.168.254.12";
const HOST_URL = process.env.REACT_APP_HOST_URL || "localhost";

import { Image } from "../data/images";
export const API_URL = `http://${HOST_URL}:3000/`;
export interface Board {
    id: string;
    name: string;
    images: Image[];
  }

export interface BoardWithImages extends Board {
    images: Image[];
  }
  
 export interface NewBoardPayload {
    name: string;
    user_id: string;
  }
  
export interface ImageItem {
    image_url: string;
    id: string;
    label: string;
    category: string;
  }

export interface NewImageItemPayload {
    label: string;
    image_url: string;
    date: string;
  }