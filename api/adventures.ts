import { API_URL } from "@/config/constants";

export type Package = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
};

export type Adventure = {
  id: string;
  title: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  imageUrl: string;
  imageAlt: string;
  images: [
    {
      url: string;
      position: number;
    }
  ];
  packages: Package[];
};

export const getAdventureById = async (id: string): Promise<Adventure> => {
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

    return data as Adventure;
  } catch (error) {
    console.error("Error getting adventure:", error);
    throw error;
  }
};
