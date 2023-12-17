import Image from "next/image";

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
import { Link } from "lucide-react";

const getAdventures = async () => {
  const res = await fetch(`${API_URL}/api/adventures`, {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default async function Adventures() {
  const adventures: AdventureCardProps[] = await getAdventures();

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
              <Button className="mt-2" variant="destructive">
                Delete
              </Button>
              <Button className="mt-2">View</Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
