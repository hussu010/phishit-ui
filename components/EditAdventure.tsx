"use client";
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
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { API_URL } from "@/config/constants";
import { set } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer";
import { AdventureCardProps } from "@/config/types";
import { Adventure } from "@/api/adventures";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.object({
    type: z.string(),
    coordinates: z.array(z.number()),
  }),
  imageUrl: z.string(),
  imageAlt: z.string(),
  images: z.array(
    z.object({
      _id: z.string(),
      url: z.string(),
      position: z.number(),
    })
  ),
  packages: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      description: z.string(),
      price: z.number(),
      duration: z.number(),
    })
  ),
});

function EditAdventure({ adventure }: { adventure: Adventure }) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [imageUrl, setImageUrl] = useState(adventure.imageUrl || "");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: adventure.title,
      description: adventure.description,
      location: {
        type: adventure.location.type,
        coordinates: adventure.location.coordinates,
      },
      imageUrl: adventure.imageUrl,
      imageAlt: adventure.imageAlt,
      images: [{ _id: "", url: "", position: 0 }],
      packages: adventure.packages,
    },
  });

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await fetch(`${API_URL}/api/upload-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const imageUrl = await response.json();
        setImageUrl(imageUrl.url);
      } else {
        console.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Perform actions with the form values.
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Adventure Detail</DialogTitle>
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
                {/* <FormField
                  control={form.control}
                  name="location.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adventure Location Type"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the location of the adventure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adventure Image URL"
                          {...field}
                          value={imageUrl}
                        />
                      </FormControl>
                      <FormDescription>
                        choose image from here.
                        <Input type="file" onChange={handleFileChange} />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default EditAdventure;
