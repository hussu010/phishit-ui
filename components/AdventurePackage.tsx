"use client";
import { Package } from "@/api/adventures";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog as DialogShadCn,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { PickDate } from "./PickDate";
import ChangePackage from "./ChangePackage";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer";

function AdventurePackage({
  packages,
  id,
}: {
  packages: Package[];
  id: string;
  }) {
  const route = useRouter();
  const [currentPackage, setCurrentPackage] = useState<Package>(packages[0]);
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);

  function handlePackage(id: string) {
    if (!isAuthenticated) {
      throw new Error("You are not logged in");
    }
    const currentPackage = packages.find((adventurePackage) => {
      return adventurePackage._id === id;
    });
    if (currentPackage) {
      setCurrentPackage(currentPackage);
    }
  }

  return (
    <>
      {packages.map((adventurePackage) => (
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
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => handlePackage(adventurePackage._id)}>
                  Book
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Start Your Adventure</DialogTitle>
                  <DialogDescription>
                    Select your preferred date and package and more...
                  </DialogDescription>
                </DialogHeader>
                <PickDate id={id} currentPackage={currentPackage} />
                <DialogFooter>
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer underline">
                      @selected package
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <h1 className="font-bold">{currentPackage.title}</h1>
                      <p>{currentPackage.description}</p>
                      <p>Duration: {currentPackage.duration} days</p>
                      <p>Price: Rs. {currentPackage.price}</p>
                    </HoverCardContent>
                  </HoverCard>
                  <ChangePackage
                    packages={packages}
                    handlePackage={handlePackage}
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </>
  );
}

export default AdventurePackage;
