"use client";
import {
  Booking,
  cancelBooking,
  getBookings,
  initPayment,
} from "@/api/booking";
import Navbar from "@/components/Navbar";
import Pdf from "@/components/Pdf";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/redux/reducer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  console.log(accessToken);
  const route = useRouter();
  useEffect(() => {
    async function getAllBookings(accessToken: string) {
      const packages = await getBookings(accessToken);
      setBookings(packages);
    }
    getAllBookings(accessToken);
  }, []);
  async function handlePay(bookingId: string) {
    const res = await initPayment(
      accessToken,
      `${window.location.protocol}//${window.location.host}/bookings/${bookingId}`,
      bookingId
    );

    route.push(res.paymentUrl);
  }

  async function handleCancel(id: string) {
    const res = await cancelBooking(accessToken, id);
    window.location.reload();
  }
  console.log(bookings);
  return (
    <section className="min-h-[90vh]">
      <Tabs defaultValue="CONFIRMED" className="w-full">
        <TabsList>
          <TabsTrigger value="CONFIRMED">CONFIRMED BOOKINGS</TabsTrigger>
          <TabsTrigger value="PENDING">PENDING BOOKINGS</TabsTrigger>
          <TabsTrigger value="EXPIRED">PAYMENT EXPIRED</TabsTrigger>
          <TabsTrigger value="CANCELLED">CANCELLED BOOKINGs</TabsTrigger>
        </TabsList>
        <TabsContent value="CONFIRMED">
          <div className="flex gap-5 flex-wrap justify-center">
            {bookings
              .filter((books) => books.status == "CONFIRMED")
              .map((booking) => {
                return (
                  <Card
                    key={booking._id}
                    className="flex flex-col gap-3 w-[400px]"
                  >
                    <CardHeader>
                      <CardTitle>{booking.package.title}</CardTitle>
                      <CardDescription className=" line-clamp-4">
                        {booking.package.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Price: Rs.{booking.package.price}</p>
                      <p>Duration: {booking.package.duration}days</p>
                      <p>Guide Name: {booking.guide.username}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                      Thanks for booking with us
                      <PDFDownloadLink
                        document={<Pdf bookingDetail={booking} />}
                        fileName="test.pdf"
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? "Loading document..." : "Download invoice!"
                        }
                      </PDFDownloadLink>
                      <Dialog>
                        <DialogTrigger>Cancel Booking</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure you want to cancel your booking?</DialogTitle>
                            <DialogDescription>
                              <Button
                                variant="destructive"
                                onClick={() => handleCancel(booking._id)}
                              >
                                Proceed
                              </Button>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
        <TabsContent value="PENDING">
          <div className="flex gap-5 flex-wrap justify-center">
            {bookings
              .filter((books) => books.payment?.status == "PENDING")
              .map((booking) => {
                return (
                  <Card
                    key={booking._id}
                    className="flex flex-col gap-3 w-[400px]"
                  >
                    <CardHeader>
                      <CardTitle>{booking.package.title}</CardTitle>
                      <CardDescription className=" line-clamp-4">
                        {booking.package.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Price: Rs.{booking.package.price}</p>
                      <p>Duration: {booking.package.duration}days</p>
                      <p>Guide Name: {booking.guide.username}</p>
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
        <TabsContent value="EXPIRED">
          <div className="flex gap-5 flex-wrap justify-center">
            {bookings
              .filter((books) => books.payment?.status == "EXPIRED")
              .map((booking) => {
                return (
                  <Card
                    key={booking._id}
                    className="flex flex-col gap-3 w-[400px]"
                  >
                    <CardHeader>
                      <CardTitle>{booking.package.title}</CardTitle>
                      <CardDescription className=" line-clamp-4">
                        {booking.package.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Price: Rs.{booking.package.price}</p>
                      <p>Duration: {booking.package.duration}days</p>
                      <p>Guide Name: {booking.guide.username}</p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handlePay(booking._id)}>
                        Pay Through Khalti
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
        <TabsContent value="CANCELLED">
          <div className="flex gap-5 flex-wrap justify-center">
            {bookings
              .filter((books) => books.payment?.status == "CANCELLED")
              .map((booking) => {
                return (
                  <Card
                    key={booking._id}
                    className="flex flex-col gap-3 w-[400px]"
                  >
                    <CardHeader>
                      <CardTitle>{booking.package.title}</CardTitle>
                      <CardDescription className=" line-clamp-4">
                        {booking.package.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Price: Rs.{booking.package.price}</p>
                      <p>Duration: {booking.package.duration}days</p>
                      <p>Guide Name: {booking.guide.username}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/adventures/${booking.adventure}`}>
                        View Adventure
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
