"use client";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Package, getAdventureById } from "@/api/adventures";
import * as z from "zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createPackages, deletePackages, editPackages } from "@/api/packages";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer";
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  price: z.string().nonempty(),
  duration: z.string().nonempty(),
});

function EditPackages({
  adventurePackage,
  adventureId,
  setPackages,
  packages,
}: {
  adventurePackage: Package;
  adventureId: string;
  setPackages: Dispatch<SetStateAction<Package[]>>;
  packages: Package[];
}) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: adventurePackage.title || "",
      description: adventurePackage.description || "",
      price: adventurePackage.price.toString() || "",
      duration: adventurePackage.duration.toString() || "",
    },
  });

  const [formError, setFormError] = useState<string>("");

  async function onEditSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    values: z.infer<typeof formSchema>,
    id: string
  ) {
    event.preventDefault();
    const { title, description, price, duration } = values;
    if (!title || !description || !price || !duration) {
      setFormError("Please fill in all fields");

      return;
    }
    const res = await editPackages(adventureId, id, accessToken, {
      title,
      description,
      duration: parseFloat(duration),
      price: parseFloat(price),
    });
    const updatedPackages = packages.map((pkg) => (pkg._id === id ? res : pkg));
    setPackages(updatedPackages);
    setFormError("");
  }

  return (
    <Dialog>
      <DialogTrigger className="p-3 bg-[black] rounded-sm text-white">
        Edit Packages
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit your adventure package
            {formError && (
              <div className="text-red-500 text-sm">{formError}</div>
            )}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                // onSubmit={form.handleSubmit(onEditSubmit)}

                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Adventure Title" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the title of the adventure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Adventure Description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the description of the adventure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adventure Price"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormDescription>
                        This is the price of the adventure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adventure duration"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormDescription>
                        Duration of adventure in days
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogClose>
                  <Button
                    onClick={(e) =>
                      onEditSubmit(e, form.getValues(), adventurePackage._id)
                    }
                  >
                    Save
                  </Button>
                </DialogClose>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditPackages;
