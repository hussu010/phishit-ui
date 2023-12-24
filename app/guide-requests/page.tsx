"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useState } from "react";

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
  SelectItem,
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
});

export default function PostCreate() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "INDIVIDUAL",
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      cover_letter: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setErrorMessage("");
      const { type, name, phoneNumber, email, address, cover_letter } = data;

      const response = await createGuideRequest({
        type,
        name,
        phoneNumber,
        email,
        address,
        cover_letter,
        accessToken,
      });

      form.reset();
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <div className="bg-white">
        <Navbar />
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Become a Guide</h2>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
