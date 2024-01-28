import { API_URL } from "@/config/constants";

export const uploadImage = async(formData:any, accessToken:string) => {
    try {
     
        const response = await fetch(`${API_URL}/api/upload-images`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });
        if (!response.ok) {
            const data = await response.json();
            if ((response.status === 500 && data.message) ||
                (response.status === 401 && data.message) ||
                (response.status === 403 && data.message) ||
                (response.status === 409 && data.message)) {
                throw new Error(data.message);
            }
            else {
                throw new Error("Unknown error occurred");
            }
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
    