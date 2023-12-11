import Image from "next/image";

import { StarIcon } from "@heroicons/react/20/solid";
import Navbar from "@/components/Navbar";

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

      {/* Product info */}
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-2 lg:pr-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {adventure.title}
          </h1>
        </div>

        <div className="py-10 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
          {/* Description and details */}
          <div>
            <h3 className="sr-only">Description</h3>

            <div className="space-y-6">
              <p className="text-base text-gray-900">{adventure.description}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl text-gray-900">Packages</h2>

            <div className="mt-4">
              <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                {adventure.packages.map((adventurePackage) => (
                  <li key={adventurePackage._id} className="text-gray-400">
                    <span className="text-gray-600">
                      {adventurePackage.title}
                    </span>
                  </li>
                ))}
              </ul>
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
