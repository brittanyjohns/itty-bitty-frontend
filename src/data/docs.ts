import { ImageDoc, Image } from "./images";
import { BASE_URL } from "./users";
const userHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

export const markAsCurrent = async (id: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}docs/${id}/mark_as_current`,
        {
            headers: userHeaders,
            method: 'POST'
        })
    const image: any = await response.json();
    console.log('markAsCurrent', image);
    return image;
}
// export async function removeImageFromMenu(id: string, image_id: string): Promise<Image> {
//     const body = JSON.stringify({ image_id });
//     console.log("Remove Image from Menu body", body);
//     const requestInfo = {
//       method: "POST",
//       headers: userHeaders,
//       body: body,
//     };
//     const response = await fetch(`${BASE_URL}menus/${id}/remove_image`, requestInfo);
//     console.log("Remove Image from Menu response", response);
//     const menu: Image = await response.json();
//     return menu;
//   }