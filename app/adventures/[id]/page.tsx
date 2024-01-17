import Image from "next/image";

import Navbar from "@/components/Navbar";

import { getAdventureById } from "@/api/adventures";
import AdventurePackage from "@/components/AdventurePackage";
import EnrollAdventureDialog from "@/components/EnrollAdventureDialog";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const adventure = await getAdventureById(id);

  return (
    <div className="absoulte bg-white">
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
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {adventure.title}
          </h2>
          <div className="flex items-center space-x-2">
            <EnrollAdventureDialog id={id} />
          </div>
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
              <AdventurePackage packages={adventure.packages} id={id} />
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
