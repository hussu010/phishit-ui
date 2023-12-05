import { API_URL } from "@/config/constants";

export const getAdventureById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/adventures/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 500 && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error("Unknown error occurred");
      }
    }

    return data;
  } catch (error) {
    console.error("Error getting adventure:", error);
    throw error;
  }
};
