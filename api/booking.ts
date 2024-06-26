import { API_URL } from "@/config/constants";
import { Package } from "./adventures";
import { Guide } from "./guide-requests";

interface PaymentDetails {
  amount: number;
  createdAt: string;
  expiresAt: string;
  method: string;
  paymentUrl: string;
  pidx: string;
  status: string;
  updatedAt: string;
  _id: string;
}

export interface Booking {
  _id: string;
  adventure: string;
  package: Package;
  guide: Guide;
  startDate: string;
  numberOfPeople: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  payment?: PaymentDetails;
}

export async function getBookings(accessToken: string) {
  try {
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error("Unknown error occurred");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
export async function getBookingById(accessToken: string, id: string) {
  try {
    const res = await fetch(`${API_URL}/api/bookings/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error("Unknown error occurred");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
export async function initPayment(
  accessToken: string,
  redirectUrl: string,
  id: string
) {
  try {
    const res = await fetch(`${API_URL}/api/bookings/${id}/initiate-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        method: "KHALTI",
        redirectUrl,
      }),
    });
    if (!res.ok) {
      throw new Error("Unknown error occurred");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function verifyPayment(accessToken: string, id: string) {
  try {
    const res = await fetch(`${API_URL}/api/bookings/${id}/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error("Unknown error occurred");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// /bookings/{id}/cancel

export async function cancelBooking(accessToken: string, id: string) {
  try {
    const res = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error("Unknown error occurred");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}