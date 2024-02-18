"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Navbar from "@/components/Navbar";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdventureCardProps } from "@/config/types";
import { API_URL } from "@/config/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/redux/reducer";
import EditAdventure from "@/components/EditAdventure";
import { Adventure } from "@/api/adventures";
import CreateAdventure from "@/components/CreateAdventure";
import AdminManagePackage from "@/components/AdminManagePackage";

const getAdventures = async () => {
  const res = await fetch(`${API_URL}/api/adventures`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default function Adventures() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    getAdventures()
      .then((adventures) => setAdventures(adventures))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/adventures/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.message || "Failed to delete adventure";
        throw new Error(
          `Error deleting adventure: ${res.status} ${errorMessage}`
        );
      }

      const newAdventures = adventures.filter(
        (adventure) => adventure._id !== id
      );

      setAdventures(newAdventures);
    } catch (err: any) {
      console.error(err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="bg-white min-h-[90vh]">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="manage-adventures" className="space-y-4">
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
      </div>
      <div className="text-center my-6">
        <CreateAdventure />
      </div>

      <section className="p-4 md:p-6  grid grid-cols-1 gap-2 md:grid-cols-3">
        {adventures.map((adventure) => (
          <Card key={adventure._id}>
            <CardHeader>
              <CardTitle>{adventure.title}</CardTitle>
              <CardDescription className=" line-clamp-5">
                {adventure.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Image
                src={adventure.imageUrl}
                alt={adventure.imageAlt}
                className="w-full h-80 object-cover"
                width={480}
                height={640}
              />
              <div className="flex items-center gap-4">
                <EditAdventure adventure={adventure} />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                      {errorMessage && (
                        <div className="text-red-500 mt-2">{errorMessage}</div>
                      )}
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the adventure.
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      className="mt-2"
                      variant="destructive"
                      onClick={() => {
                        handleDelete(adventure._id);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogContent>
                </Dialog>
                <AdminManagePackage adventureId={adventure._id} />
                <Link
                  href={`/adventures/${adventure._id}`}
                  target="_blank"
                  className={buttonVariants({ variant: "default" })}
                >
                  View
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
