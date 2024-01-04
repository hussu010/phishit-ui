import { API_URL } from "@/config/constants";

export type GuideRequest = {
  _id: string;
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  cover_letter: string;
};

export const createGuideRequest = async ({
  type,
  name,
  phoneNumber,
  email,
  address,
  message,
  documents,
  accessToken,
}: {
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
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
