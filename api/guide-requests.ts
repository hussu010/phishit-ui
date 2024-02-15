import { API_URL } from "@/config/constants";
import { GuideRequestProps } from "@/config/types";

export type GuideRequest = {
  _id: string;
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  cover_letter: string;
};

export type Guide = {
  _id: string;
  username: string;
  isAvailable: boolean;
};

export const createGuideRequest = async ({
  type,
  name,
  phoneNumber,
  email,
  address,
  gender,
  dateOfBirth,
  message,
  documents,
  accessToken,
}: {
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  message: string;
  documents: { url: string; type: string }[];
  accessToken: string;
}): Promise<GuideRequest> => {
  try {
    const response = await fetch(`${API_URL}/api/guide-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        type,
        name,
        phoneNumber,
        email,
        address,
        message,
        gender,
        dateOfBirth,
        documents,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 500 && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error("Unknown error occurred");
      }
    }

    return data as GuideRequest;
  } catch (error) {
    console.error("Error creating guide request:", error);
    throw error;
  }
};

export const getGuideRequests = async (auth: string) => {
  try {
    const response = await fetch(`${API_URL}/api/guide-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
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
    return data as GuideRequestProps[];
  } catch (error) {
    console.error("Error getting guide requests:", error);
    throw error;
  }
};
