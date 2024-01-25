"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, set, useForm } from "react-hook-form";
import * as z from "zod";

import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createGuideRequest } from "@/api/guide-requests";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const FormSchema = z.object({
  type: z.enum(["INDIVIDUAL", "ORGANIZATION"], {
    required_error: "You need to select a type.",
  }),
  name: z.string().min(3).max(255),
  phoneNumber: z.string().min(10).max(10),
  email: z.string().email(),
  address: z.string().min(3).max(255),
  cover_letter: z.string().min(3).max(255),
  documentTitle: z.enum([
    "NID",
    "PASSPORT",
    "COMPANY_REGISTRATION_CERTIFICATE",
    "OTHER",
  ]),
  document: z.any().refine(
    (file) => {
      return (
        file &&
        (file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/webp")
      );
    },
    {
      message: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
    }
  ),
});

export default function PostCreate() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { roles } = useSelector((state: RootState) => state.users);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const [documentDetail, setDocumnetDetail] = useState<
    { url: string; type: string }[]
  >([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "INDIVIDUAL",
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      cover_letter: "",
      documentTitle: "OTHER",
    },
  });

  function deleteDetail(
    e: React.MouseEvent<HTMLButtonElement>,
    indexToDelete: number
  ) {
    e.preventDefault();
    const updatedData = documentDetail.filter(
      (_: any, index: number) => index !== indexToDelete
    );
    setDocumnetDetail(updatedData);
  }
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setErrorMessage("");
      const { type, name, phoneNumber, email, address, cover_letter } = data;

      if (documentDetail.length === 0) {
        throw new Error("Please upload at least one document.");
      }

      await createGuideRequest({
        type,
        name,
        phoneNumber,
        email,
        address,
        message: cover_letter,
        documents: documentDetail,
        accessToken,
      });

      form.reset();
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }

  async function saveImage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const { document, documentTitle } = form.getValues();

    try {
      // Validate 'documentTitle' field using Zod
      FormSchema.pick({ documentTitle: true }).parse({ documentTitle });

      // Perform file type validation for 'document'
      const file = document as File;
      if (
        file &&
        (file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/webp")
      ) {
        const formData = new FormData();
        formData.append("images", file);

        const response = await fetch(`${baseURL}/api/upload-images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          console.error("Error uploading file:", response.statusText);
        } else {
          const data = await response.json();
          // Validate 'documentTitle' against allowed values
          FormSchema.pick({ documentTitle: true }).parse({ documentTitle });

          setDocumnetDetail((prev: any) => [
            ...prev,
            { url: data.url, type: documentTitle },
          ]);

          form.setValue("document", undefined);
          form.setValue("documentTitle", "OTHER");
        }
      } else {
        throw new Error(
          "Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {roles.includes("GUIDE") ? (
        <div className="h-[80vh] flex flex-col gap-5 items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight">
            You are already a guide
          </h1>
          <Button>
            <Link href="/profile">View Profile</Link>
          </Button>
        </div>
      ) : (
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Become a Guide
            </h2>
          </div>
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>You are</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="INDIVIDUAL" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            INDIVIDUAL
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="ORGANIZATION" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            ORGANIZATION
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="your full name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cover_letter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="why are you applying to become a guide"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <fieldset className="border-[#222] border-[2px] p-[20px] flex flex-col gap-[40px]">
                <legend className="bg-black text-white px-5 py-2">
                  Attach Document
                </legend>
                <FormField
                  control={form.control}
                  name="documentTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Document Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="NID">NID</SelectItem>
                              <SelectItem value="PASSPORT">PASSPORT</SelectItem>
                              <SelectItem value="COMPANY_REGISTRATION_CERTIFICATE">
                                COMPANY_REGISTRATION_CERTIFICATE
                              </SelectItem>
                              <SelectItem value="OTHER">OTHER</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Upload documents
                        {documentDetail && (
                          <div className="flex gap-5 overflow-x-scroll">
                            {documentDetail.map((item: any, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="flex flex-col gap-2 border-b"
                                >
                                  <Image
                                    src={item.url}
                                    alt="type"
                                    width={200}
                                    height={200}
                                  />
                                  <p>{item.type}</p>
                                  <Button
                                    variant="destructive"
                                    onClick={(e) => deleteDetail(e, index)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files![0];
                            // Update form state with the selected file
                            form.setValue("document", file);
                            // Optionally, handle additional logic related to the file selection
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={saveImage}>save</Button>
              </fieldset>
              <br />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}
