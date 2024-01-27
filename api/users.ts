import { API_URL } from "@/config/constants";

export interface UserProfile {
  _id: string;
  user: string;
  fullName: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER"; // Assuming gender is one of these options
  dateOfBirth: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

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

export const profile = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/profiles`, {
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
}