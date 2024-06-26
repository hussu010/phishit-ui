import { API_URL } from "@/config/constants";
import { Adventure } from "./adventures";

export interface UserProfile {
  _id: string;
  user: string;
  fullName: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER"; // Assuming gender is one of these options
  dateOfBirth: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
export interface UserMe {
  isAvailable: boolean;
  _id: string;
  phoneNumber: string;
  __v: number;
  createdAt: string;
  isActive: boolean;
  roles: string[];
  updatedAt: string;
  username: string;
  adventures: Adventure[];
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
        (response.status === 500) &&
        data.message
      ) {
        throw new Error(data.message);
      }
      else if (response.status === 401) {
        return { expire: true };
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
        return data.message;
      } else {
        return {};
      }
    }

    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

export const updateProfile = async (token: string, profile: any) => {
  try {
    const response = await fetch(`${API_URL}/api/profiles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    const data = await response.json();

    if (!response.ok) {
      if (
        (response.status === 500 || response.status === 401) &&
        data.message
      ) {
        throw new Error(data.message);
      } else {
        return {};
      }
    }

    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

// /users/me/update-available-status

export const updateAvailableStatus = async (token: string, status: boolean) => {
  try {
    const response = await fetch(
      `${API_URL}/api/users/me/update-available-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (
        (response.status === 500 || response.status === 401) &&
        data.message
      ) {
        throw new Error(data.message);
      } else {
        return {};
      }
    }

    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

export const getUserByName = async (username: string) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${username}`);

    const data = await response.json();

    if (!response.ok) {
      if (
        (response.status === 500 || response.status === 401) &&
        data.message
      ) {
        throw new Error(data.message);
      } else {
        return {};
      }
    }

    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};