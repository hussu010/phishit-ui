import { API_URL } from "@/config/constants";

export type Package = {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
};

export type Adventure = {
  _id: string;
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

export type AdventureTime = {
  starDate: string;
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

export const postAdventureReqGuide = async (
  id: string,
  accessToken: string,
  date: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/adventures/${id}/guides`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        startDate: date,
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
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const BookAdventure = async (
  adventureId: string,
  packageId: string,
  guideId: string,
  startDate: string,
  noOfPeople: number,
  accessToken: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        adventureId,
        packageId,
        guideId,
        startDate,
        noOfPeople,
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
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const EnrollAdventure = async ({
  adventureId,
  accessToken,
}: {
  adventureId: string;
  accessToken: string;
}) => {
  try {
    const response = await fetch(
      `${API_URL}/api/adventures/${adventureId}/enroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (
        (response.status === 500 && data.message) ||
        (response.status === 401 && data.message) ||
        (response.status === 403 && data.message) ||
        (response.status === 409 && data.message)
      ) {
        throw new Error(data.message);
      } else {
        throw new Error("Unknown error occurred");
      }
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const UnenrollAdventure = async({
  adventureId,
  accessToken,
}: {
  adventureId: string;
  accessToken: string;
}) => {
  try {
    const response = await fetch(
      `${API_URL}/api/adventures/${adventureId}/unenroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    
    if (!response.ok) {
      const data = await response.json();
      if (
        (response.status === 500 && data.message) ||
        (response.status === 401 && data.message) ||
        (response.status === 403 && data.message) ||
        (response.status === 409 && data.message)
        ) {
          throw new Error(data.message);
        } else {
          throw new Error("Unknown error occurred");
        }
      }
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
}