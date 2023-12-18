import { API_URL } from "@/config/constants";

export const getMe = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (
        (response.status === 500 || response.status === 401) &&
        data.message
      ) {
        throw new Error(data.message);
      } else {
        throw new Error("Unknown error occurred");
      }
    }

    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};
