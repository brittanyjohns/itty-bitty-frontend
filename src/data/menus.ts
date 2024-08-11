import { Board } from "./boards";
import { Image } from "./images";
import { BASE_URL, userHeaders } from "./constants";

export interface Menu {
  id?: string;
  name: string;
  description?: string;
  file?: File;
  displayImage?: string;
  images?: Image[];
  boardId?: string;
  board: Board;
  token_limit?: number;
  can_edit?: boolean;
  status?: string;
  has_generating_images: boolean;
}

export const getMenus = () => {
  const menus = fetch(`${BASE_URL}menus`, { headers: userHeaders }) // `localhostmenus
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return menus;
};

export const rerunMenuJob = (id: string) => {
  const updatedMenu = fetch(`${BASE_URL}menus/${id}/rerun`, {
    method: "POST",
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error rerunning menu: ", error));

  return updatedMenu;
};

export const getMenu = (id: number) => {
  const menu = fetch(`${BASE_URL}menus/${id}`, { headers: userHeaders }) // `localhostmenus
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return menu;
};

export const createMenu = (formData: FormData) => {
  for (var pair of formData.entries()) {
  }
  const newMenu = fetch(`${BASE_URL}menus`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error creating menu: ", error));

  return newMenu;
};

export const updateMenu = (menu: Menu) => {
  const updatedMenu = fetch(`${BASE_URL}menus/${menu.id}`, {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify(menu),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error updating menu: ", error));

  return updatedMenu;
};

export const deleteMenu = (id: string) => {
  const result = fetch(`${BASE_URL}menus/${id}`, {
    method: "DELETE",
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error deleting menu: ", error));

  return result;
};

export async function addImageListToMenu(
  id: string,
  payload: { word_list: string[] }
): Promise<Menu> {
  const requestInfo = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const response = await fetch(
    `${BASE_URL}menus/${id}/add_word_list`,
    requestInfo
  );
  const menu: Menu = await response.json();
  return menu;
}

export async function getMenuImages(id: string, props: any): Promise<Image[]> {
  const response = await fetch(
    `${BASE_URL}menus/${id}/remaining_images?page=${props.page}&query=${props.query}`,
    { headers: userHeaders }
  );
  const images: Image[] = await response.json();
  return images;
}

export async function addImageToMenu(
  id: string,
  image_id: string
): Promise<Menu> {
  const requestInfo = {
    method: "PUT",
    headers: userHeaders,
    body: JSON.stringify({ image_id }),
  };
  const response = await fetch(
    `${BASE_URL}menus/${id}/associate_image`,
    requestInfo
  );
  const menu: Menu = await response.json();
  return menu;
}

export async function removeImageFromMenu(
  id: string,
  image_id: string
): Promise<Menu> {
  const body = JSON.stringify({ image_id });
  const requestInfo = {
    method: "POST",
    headers: userHeaders,
    body: body,
  };
  const response = await fetch(
    `${BASE_URL}menus/${id}/remove_image`,
    requestInfo
  );
  const menu: Menu = await response.json();
  return menu;
}
