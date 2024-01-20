"use client";
import { Booking, getBookings } from "@/api/booking";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/redux/reducer";
import Link from "next/link";
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
      <Tabs defaultValue="CONFIRMED" className="w-full">
        <TabsList>
          <TabsTrigger value="CONFIRMED">CONFIRMED BOOKINGS</TabsTrigger>
          <TabsTrigger value="PENDING">PENDING BOOKINGS</TabsTrigger>
        </TabsList>
        <TabsContent value="CONFIRMED">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
            {bookings
              .filter((books) => books.status == "CONFIRMED")
              .map((booking) => {
                return (
                  <Card key={booking._id}>
                    <CardHeader>
                      <CardTitle>
                        Package Name: {booking.package.title}
                      </CardTitle>
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
        </TabsContent>
        <TabsContent value="PENDING">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
            {bookings
              .filter((books) => books.status == "PENDING")
              .map((booking) => {
                return (
                  <Card key={booking._id}>
                    <CardHeader>
                      <CardTitle>
                        Package Name: {booking.package.title}
                      </CardTitle>
                      <CardDescription>
                        Package id: {booking.package._id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Guide Name:</p>
                    </CardContent>
                    <CardFooter>
                      <Button>
                        <Link href={`/bookings/${booking._id}`}>
                          Confirm Payment
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
