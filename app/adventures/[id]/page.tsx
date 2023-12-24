import Image from "next/image";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import { getAdventureById } from "@/api/adventures";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const adventure = await getAdventureById(id);

  return (
    <div className="absoulte bg-white">
      <Navbar />
      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
        {adventure.images.map((image, index) => (
          <div
            key={index}
            className="group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <Image
              src={image.url}
              alt={image.url}
              className="w-full h-80 object-cover"
              width={480}
              height={640}
            />
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-2 lg:pr-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {adventure.title}
          </h1>
        </div>

        <div className="py-10 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
          <div>
            <h3 className="sr-only">Description</h3>

            <div className="space-y-6">
              <p className="text-base text-gray-900">{adventure.description}</p>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Packages
            </h1>

            <div className="mt-4">
              {adventure.packages.map((adventurePackage) => (
                <div
                  key={adventurePackage._id}
                  className="flex flex-col justify-between py-4 border-t border-gray-200"
                >
                  <div className="flex justify-between">
                    <h2 className="text-xl font-medium text-gray-900">
                      {adventurePackage.title}
                    </h2>
                    <p className="text-sm text-gray-800">
                      Rs. {adventurePackage.price}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600">
                    {adventurePackage.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {adventurePackage.duration} days
                  </p>
                  <div className="flex justify-end my-2">
                    <Button className="mx-2">Book Now</Button>
                    <Button className="mx-2">Subscribe to this package</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-medium text-gray-900">Details</h2>

            <div className="mt-4 space-y-6">
              <p className="text-sm text-gray-600">{adventure.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
