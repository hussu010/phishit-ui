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
import { RootState } from "@/redux/reducer";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const param = useSearchParams();

  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [booking, setBooking] = useState<Booking>();
  const payment = "confirmed";

  useEffect(() => {
    async function getBooking(accessToken: string, bookId: string) {
      const book = await getBookingById(accessToken, bookId);
      setBooking(book);
    }
    getBooking(accessToken, id);
  }, []);

  async function handlePay(bookingId: string | undefined) {
    const response = await initPayment(
      accessToken,
      window.location.href,
      bookingId || ""
    );
    if (response) {
      window.location.href = response.paymentUrl;
    }
  }

  async function confirmPayment() {
    const response = await verifyPayment(accessToken, id);
  }
  return (
    <>
      {payment !== "confirmed" ? (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="max-w-[50%]">
            <CardHeader>
              <CardTitle>Payment For Adventure</CardTitle>
              <CardDescription>pay us through khalti</CardDescription>
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
              <Button onClick={() => handlePay(booking?._id)}>Pay</Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen items-center justify-center">
          <fieldset className="flex flex-col gap-3 border border-[black] p-4">
            <legend>Confirm Payment</legend>
            <Button onClick={confirmPayment}>Confirm</Button>
            <Button variant={"destructive"}>Cancel</Button>
          </fieldset>
        </div>
      )}
    </>
  );
}
