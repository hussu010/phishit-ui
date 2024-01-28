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
import { ScrollArea } from "@/components/ui/scroll-area";

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
import { Adventure, updateAdventure } from "@/api/adventures";
import { uploadImage } from "@/api/images";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.object({
    type: z.string(),
    longitudeCoordinates: z.string(),
    latitudeCoordinates: z.string(),
  }),
  imageUrl: z.string(),
  imageAlt: z.string(),
  image1: z.string(),
  image2: z.string(),
  image3: z.string(),
});

function EditAdventure({ adventure }: { adventure: Adventure }) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [images, setImages] = useState<string[]>(
    adventure.images.map((image) => image.url) || []
  );
  const [imageUrl, setImageUrl] = useState(adventure.imageUrl || "");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: adventure.title,
      description: adventure.description,
      location: {
        type: adventure.location.type,
        latitudeCoordinates: `${adventure.location.coordinates[0]}`,
        longitudeCoordinates: `${adventure.location.coordinates[1]}`,
      },
      imageUrl: adventure.imageUrl,
      imageAlt: adventure.imageAlt,
      image1: images[0] || "",
      image2: images[1] || "",
      image3: images[2] || "",
    },
  });

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("images", file);

    const res = await uploadImage(formData, accessToken);
    setImageUrl(res.url);
  };
  const handleFirstImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("images", file);

    const res = await uploadImage(formData, accessToken);
    setImages((prevImages) => {
      // Create a new array by spreading the previous images
      const newImages = [...prevImages];

      // Update the URL of the first image
      if (newImages.length > 0) {
        newImages[0] = res.url;
      }

      return newImages;
    });
  };
  const handleSecondImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("images", file);

    const res = await uploadImage(formData, accessToken);
    setImages((prevImages) => {
      // Create a new array by spreading the previous images
      const newImages = [...prevImages];

      // Update the URL of the first image
      if (newImages.length > 1) {
        newImages[1] = res.url;
      }

      return newImages;
    });
  };
  const handleThirdImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("images", file);

    const res = await uploadImage(formData, accessToken);
    setImages((prevImages) => {
      // Create a new array by spreading the previous images
      const newImages = [...prevImages];

      // Update the URL of the first image
      if (newImages.length > 2) {
        newImages[2] = res.url;
      }

      return newImages;
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      title,
      description,
      location,
      imageUrl,
      imageAlt,
      image1,
      image2,
      image3,
    } = values;

    const res = await updateAdventure(accessToken, adventure._id, {
      title,
      description,
      imageUrl: imageUrl,
      imageAlt,
      location: {
        type: location.type,
        coordinates: [
          parseFloat(location.latitudeCoordinates),
          parseFloat(location.longitudeCoordinates),
        ],
      },
      images: [
        { url: images[0], position: 0 },
        { url: images[1], position: 1 },
        { url: images[2], position: 2 },
      ],
    });
    if (res) {
      window.location.reload();
    }
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
            <ScrollArea className="h-[500px]">
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
                  <FormField
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
                  <FormField
                    control={form.control}
                    name="location.latitudeCoordinates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Adventure Location Latitude"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the latitude of the adventure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location.longitudeCoordinates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Adventure Location Longitude"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the longitude of the adventure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="imageAlt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Alt</FormLabel>
                        <FormControl>
                          <Input placeholder="Adventure Image Alt" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the image alt of the adventure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Adventure Image1"
                            {...field}
                            value={images[0]}
                            readOnly
                          />
                        </FormControl>
                        <FormDescription>
                          <Input type="file" onChange={handleFirstImage} />
                          This is the image1 of the adventure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Adventure Image2"
                            {...field}
                            value={images[1]}
                            readOnly
                          />
                        </FormControl>
                        <FormDescription>
                          <Input type="file" onChange={handleSecondImage} />
                          This is the image2 of the adventure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image3</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Adventure Image3"
                            {...field}
                            value={images[2]}
                            readOnly
                          />
                        </FormControl>
                        <FormDescription>
                          <Input type="file" onChange={handleThirdImage} />
                          This is the image3 of the adventure.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default EditAdventure;
