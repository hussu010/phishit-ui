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

const getAdventures = async () => {
  const res = await fetch(`${API_URL}/api/adventures`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default function Adventures() {
  const [adventures, setAdventures] = useState<AdventureCardProps[]>([]);
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
    <div className="bg-white">
      <Navbar />

      <div className="text-center my-6">
        <h2 className="mt-4 text-lg font-bold tracking-tight text-gray-900 sm:text-4xl">
          Modify Adventures
        </h2>
        <Button className="mt-2" variant="default">
          Create New Adventure
        </Button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
        {adventures.map((adventure) => (
          <Card key={adventure._id}>
            <CardHeader>
              <CardTitle>{adventure.title}</CardTitle>
              <CardDescription>{adventure.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Image
                src={adventure.imageUrl}
                alt={adventure.imageAlt}
                className="w-full h-80 object-cover"
                width={480}
                height={640}
              />
              <Button className="mt-2" variant="outline">
                Edit
              </Button>
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
                      This action cannot be undone. This will permanently delete
                      the adventure.
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

              <Link
                href={`/adventures/${adventure._id}`}
                target="_blank"
                className={buttonVariants({ variant: "default" })}
              >
                View
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
