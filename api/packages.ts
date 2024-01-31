import { API_URL } from "@/config/constants";

export const createPackages = async (
  id: string,
  accessToken: string,
  packageDetail: {
    title: string;
    duration: number;
    price: number;
    description: string;
  }
) => {
  const response = await fetch(`${API_URL}/api/adventures/${id}/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...packageDetail }),
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return await response.json();
};

export const editPackages = async (
  advId: string,
  packId: string,
  accessToken: string,
  packageDetail: {
    title: string;
    duration: number;
    price: number;
    description: string;
  }
) => {
  const response = await fetch(
    `${API_URL}/api/adventures/${advId}/packages/${packId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...packageDetail }),
    }
  );
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return await response.json();
};

export const deletePackages = async (
  advId: string,
  packId: string,
  accessToken: string
) => {
  const response = await fetch(
    `${API_URL}/api/adventures/${advId}/packages/${packId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return response;
};
