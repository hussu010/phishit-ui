"use client";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Package } from "@/api/adventures";

export default function ChangePackage({
  packages,
  handlePackage,
}: {
  packages: Package[];
  handlePackage: (id: string) => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Change Package</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full p-4">
          <DrawerHeader>
            <DrawerTitle>Change Package</DrawerTitle>
            <DrawerDescription>
              choose best package for yourself
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid md:grid-cols-5 grid-cols-3 gap-3">
            {packages.map((adventurePackage) => {
              return (
                <DrawerClose
                  asChild
                  key={adventurePackage._id}
                  onClick={() => handlePackage(adventurePackage._id)}
                >
                  <Card className="cursor-pointer">
                    <CardHeader>
                      <CardTitle>{adventurePackage.title}</CardTitle>
                      <CardDescription className=" line-clamp-2">
                        {adventurePackage.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Duration: {adventurePackage.duration} days</p>
                    </CardContent>
                    <CardFooter>
                      <p>Nrs. {adventurePackage.price}</p>
                    </CardFooter>
                  </Card>
                </DrawerClose>
              );
            })}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
