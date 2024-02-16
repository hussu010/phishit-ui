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

import React, { useEffect, useState } from "react";
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

function AdminManagePackage({ adventureId }: { adventureId: string }) {
  const [packages, setPackages] = React.useState<Package[]>([]);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // title: "",
      // description: "",
      // price: "",
      // duration: "",
    },
  });

  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    const getPackages = async () => {
      const res = await getAdventureById(adventureId);
      setPackages(res.packages);
    };
    getPackages();
  }, []);

  function handleDelete(id: string) {
    const res = deletePackages(adventureId, id, accessToken);
    setPackages(
      packages.filter((adventurePackage) => adventurePackage._id !== id)
    );
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, description, price, duration } = values;
    const res = await createPackages(adventureId, accessToken, {
      title,
      description,
      duration: parseFloat(duration),
      price: parseFloat(price),
    });
    setPackages([...packages, res]);
    // Manually reset form values to empty strings
    form.setValue("title", "");
    form.setValue("description", "");
    form.setValue("price", "");
    form.setValue("duration", "");
  }
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
    // form.setValue("title", "");
    // form.setValue("description", "");
    // form.setValue("price", "");
    // form.setValue("duration", "");
  }

  console.log(packages);
  return (
    <Drawer>
      <DrawerTrigger>
        <Button>Manage Packages</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex justify-between items-center">
            Save to keep changes
            <Dialog>
              <DialogTrigger className="p-3 bg-[black] rounded-sm text-white">
                Create a new package
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Create a new package for your adventure
                  </DialogTitle>
                  <DialogDescription>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Adventure Title"
                                  {...field}
                                />
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

                        <Button type="submit">Save</Button>
                      </form>
                    </Form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DrawerTitle>
          <ScrollArea className="max-h-[80vh]">
            <DrawerDescription>
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
                  <p className="mt-2 text-sm text-gray-500">
                    {adventurePackage.description}
                  </p>
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger className="p-3 bg-[black] rounded-sm text-white">
                          Edit Packages
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Edit your adventure package
                              {formError && (
                                <div className="text-red-500 text-sm">
                                  {formError}
                                </div>
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
                                    defaultValue={adventurePackage.title}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Adventure Title"
                                            {...field}
                                          />
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
                                    defaultValue={adventurePackage.description}
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
                                          This is the description of the
                                          adventure.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="price"
                                    defaultValue={adventurePackage.price.toString()}
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
                                    defaultValue={adventurePackage.duration.toString()}
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
                                        onEditSubmit(
                                          e,
                                          form.getValues(),
                                          adventurePackage._id
                                        )
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
                      <Dialog>
                        <DialogTrigger className="p-3 bg-red-400 rounded-sm text-white">
                          Delete
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                              <div className="flex justify-end mt-4">
                                <Button
                                  onClick={() => {
                                    handleDelete(adventurePackage._id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </DrawerDescription>
          </ScrollArea>
        </DrawerHeader>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AdminManagePackage;
