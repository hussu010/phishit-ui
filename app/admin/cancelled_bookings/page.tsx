"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/config/constants";
import { RootState } from "@/redux/reducer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Page() {
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const { roles } = useSelector((state: RootState) => state.users);
  const [cancelledBookin, setCancelledBookin] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/backoffice/bookings?status=CANCELLED`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCancelledBookin(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(cancelledBookin);
  return (
    <div className="bg-white">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="cancelled_bookings" className="space-y-4">
          <TabsList>
            <Link href="/admin/adventures">
              <TabsTrigger value="manage-adventures">
                Manage Adventures
              </TabsTrigger>
            </Link>
            <Link href="/admin/guide-requests">
              <TabsTrigger value="guide-requests">Guide Requests</TabsTrigger>
            </Link>
            <Link href="/admin/interactions">
              <TabsTrigger value="interactions">Recent Activities</TabsTrigger>
            </Link>
            <Link href="/admin/cancelled_bookings">
              <TabsTrigger value="cancelled_bookings">
                Cancelled Bookings
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        <section className="grid md:grid-cols-3 grid-col-1">
          {cancelledBookin.map((booking) => {
            return (
              <Card key={booking._id} className="flex flex-col gap-3 w-[400px]">
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
                  <Link href={`/adventures/${booking.adventureId}`}>
                    View Adventure
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default Page;
