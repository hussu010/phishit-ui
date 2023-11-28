import Link from "next/link";
import Image from "next/image";
import React from "react";

interface AdventureCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

const getAdventures = async () => {
  const res = await fetch("http://localhost:5000/api/adventures");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const AdventureCard: React.FC<AdventureCardProps> = ({
  _id,
  title,
  description,
  imageUrl,
  imageAlt,
}) => {
  return (
    <div key={_id} className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-2xl">
            {title}
            <Link href={`/adventures/${_id}`} className="absolute inset-0" />
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Adventure = async () => {
  const adventures: AdventureCardProps[] = await getAdventures();

  return (
    <>
      <div className="absolute inset-x-0 z-50 bg-white">
        <div className="text-center my-6">
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Popular Adventures
          </h1>
        </div>
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-18 lg:max-w-7xl lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {adventures.map((adventure) => (
              <AdventureCard
                key={adventure._id}
                _id={adventure._id}
                title={adventure.title}
                description={adventure.description}
                imageUrl={adventure.imageUrl}
                imageAlt={adventure.imageAlt}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Adventure;
