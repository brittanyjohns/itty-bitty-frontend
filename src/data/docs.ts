import { BASE_URL, userHeaders } from "./constants";

export const markAsCurrent = async (id: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}docs/${id}/mark_as_current`,
        {
            headers: userHeaders,
            method: 'POST'
        })
    const image: any = await response.json();
    return image;
}