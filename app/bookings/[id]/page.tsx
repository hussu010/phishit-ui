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
    route.refresh();
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
              <Button><Link href="/bookings">View Your Bookings</Link></Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen items-center justify-center">
          <fieldset className="flex flex-col gap-3 border border-[black] p-4">
              <legend>Confirm Payment</legend>
              <p>Your payment is no yet Verified</p>
            <Button onClick={confirmPayment} className="bg-green-400">Confirm</Button>
            <Button variant={"destructive"}>Cancel</Button>
          </fieldset>
        </div>
      )}
    </>
  );
}
