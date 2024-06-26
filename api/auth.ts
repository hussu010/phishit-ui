import { API_URL } from "@/config/constants";

export async function sendOtp(phoneNumber: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.errors) {
        const errors: { [key: string]: string } = {};
        data.errors.forEach((error: any) => {
          errors[error.path] = error.msg;
        });
        throw errors;
      } else if (response.status === 500 && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error("Unknown error occurred");
      }
    }

    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

export const createJWT = async ({
  code,
  method,
  phoneNumber,
}: {
  code: string;
  method: string;
  phoneNumber?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/jwt/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, code, method }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && data.errors) {
        const errors: { [key: string]: string } = {};
        data.errors.forEach((error: any) => {
          errors[error.path] = error.msg;
        });
        throw errors;
      } else if (
        (response.status === 500 && data.message) ||
        (response.status === 401 && data.message)
      ) {
        throw new Error(data.message);
      } else {
        throw new Error("Unknown error occurred");
      }
    }
    return data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing access token", error);
    throw error;
  }
};

// Function to check if the access token is expired
export const isAccessTokenExpired = (accessToken: string) => {
  // Implement your logic to check if the access token is expired here
  return false; // Replace with your actual logic
};

// Function to check if the refresh token is expired
export const isRefreshTokenExpired = (refreshToken: string) => {
  // Implement your logic to check if the refresh token is expired here
  return false; // Replace with your actual logic
};

export const getGoogleAuthUrl = async () => {
  try {
    const ORIGIN = window.location.origin;

    const response = await fetch(
      `${API_URL}/api/auth/o/google?redirect_uri=${ORIGIN}/auth/google/callback`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting Google auth URL", error);
    throw error;
  }
};
