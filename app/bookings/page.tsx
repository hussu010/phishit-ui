"use client";
import { Booking, getBookings } from "@/api/booking";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/redux/reducer";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  console.log(accessToken);
  const router = useRouter();
  useEffect(() => {
    async function getAllBookings(accessToken: string) {
      const packages = await getBookings(accessToken);
      setBookings(packages);
    }
    getAllBookings(accessToken);
  }, []);
  console.log(bookings);
  return (
    <>
      <h1 className="text-2xl font-bold">All Your Packages</h1>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
        {bookings.filter(books => books.status == "CONFIRMED").map((booking) => {
          return (
            <Card key={booking._id}>
              <CardHeader>
                <CardTitle>Package Name: {booking.package.title} { booking._id}</CardTitle>
                <CardDescription>
                  Package id: {booking.package._id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Guide Name:</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
