"use client";
import {
  Booking,
  getBookingById,
  getBookings,
  initPayment,
  verifyPayment,
} from "@/api/booking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/reducer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const param = useSearchParams();
  const route = useRouter();

  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [booking, setBooking] = useState<Booking>();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function getBooking(accessToken: string, bookId: string) {
      const book = await getBookingById(accessToken, bookId);

      setBooking(book);
      console.log(book);
    }
    getBooking(accessToken, id);
  }, []);

  async function confirmPayment() {
    const response = await verifyPayment(accessToken, id);
    if (!response.status) {
      setMessage(response.message);
      return;
    }
    if (response.status == "CONFIRMED") {
      route.push(`/bookings`);
    } else {
    }
  }
  async function handlePay() {
    const res = await initPayment(
      accessToken,
      `${window.location.protocol}//${window.location.host}/bookings/${id}`,
      id
    );

    route.push(res.paymentUrl);
  }

  return (
    <>
      {booking?.status == "CONFIRMED" ? (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="max-w-[50%]">
            <CardHeader>
              <CardTitle>Thank You</CardTitle>
              <CardDescription>Your pay is confirmed</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="underline">Package Detail</p>
                <p className="text-[10px]">
                  <span className="font-bold text-base">Package Name:</span>{" "}
                  {booking?.package.title}
                </p>
                <p className="text-[10px]">
                  <span className="font-bold text-base">
                    Package Descrition:
                  </span>{" "}
                  {booking?.package.description}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="underline">Guide Detail</p>
                <p className="text-[10px]">
                  <span className="font-bold text-base">Guide Name: </span>{" "}
                  {booking?.guide.username}
                </p>
                <p className="text-[10px]">
                  <span className="font-bold text-base">Guide Id: </span>{" "}
                  {booking?.guide._id}
                </p>
              </div>

              <p className="text-[10px]">
                <span className="font-bold text-base">Start Date: </span>{" "}
                {booking?.startDate}
              </p>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href="/bookings">View Your Bookings</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col min-h-[80vh] items-center justify-center">
          <h1 className="text-[26px] font-bold">
            Looks like your request is still pending
          </h1>
          <p className="text-sm font-extralight">click confirm to verify</p>
          <fieldset className="flex flex-col gap-4 border border-[black] p-4 w-[500px]">
            <legend>Confirm Payment</legend>
            {message && <p className="text-red-500">{message}</p>}
            {booking?.payment?.status == "EXPIRED" ||
            message == "Payment expired" ? (
              <>
                <p>Payment session is expires</p>
                <Button onClick={handlePay}>Pay through Khalti</Button>
              </>
            ) : (
              <>
                <p>Your payment is no yet Verified</p>
                <Button onClick={confirmPayment} className="bg-green-400">
                  Confirm
                </Button>
                <Button variant={"destructive"}>
                  <Link href="/">Cancel</Link>
                </Button>
              </>
            )}
          </fieldset>
          <div className="flex gap-4 mt-3">
            <Button>
              <Link href="/bookings">View Your Bookings</Link>
            </Button>
            <Button>
              <Link href="/adventures">Try Booking again</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
