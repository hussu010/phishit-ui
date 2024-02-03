"use client";
import {
  Adventure,
  UnenrollAdventure,
  updateAdventure,
} from "@/api/adventures";
import {
  UserMe,
  UserProfile,
  getMe,
  profile,
  updateAvailableStatus,
  updateProfile,
} from "@/api/users";
import { RootState } from "@/redux/reducer";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Invalid date format. Please use YYYY-MM-DD.",
  }),
  bio: z.string(),
});

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      gender: "MALE",
      dateOfBirth: "",
      bio: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { fullName, email, gender, dateOfBirth, bio } = values;
    const res = await updateProfile(accessToken, {
      fullName,
      email,
      gender,
      dateOfBirth,
      bio,
    });
    console.log(values);
    setUserDetail(res);
    setIsEditing(false);
  }

  const [userDetail, setUserDetail] = useState<UserProfile>();
  const [enrollAdventure, setEnrollAdventure] = useState<UserMe>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { roles } = useSelector((state: RootState) => state.users);

  async function getEnrolledAventure(accessToken: string) {
    const response = await getMe(accessToken);
    setEnrollAdventure(response);
  }

  async function getUserDetail(accessToken: string) {
    const response = await profile(accessToken);
    if (!response) return;
    setUserDetail(response);
  }

  useEffect(() => {
    getUserDetail(accessToken);
    getEnrolledAventure(accessToken);
  }, []);

  async function unenrollAdventure(id: string) {
    await UnenrollAdventure({ adventureId: id, accessToken: accessToken });
    getEnrolledAventure(accessToken);
  }

  async function changeAvailble() {
    const response = await updateAvailableStatus(
      accessToken,
      !enrollAdventure?.isAvailable
    );
    getEnrolledAventure(accessToken);
  }
  // State to manage user data
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 px-[50px]"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
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
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>This is your email address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input placeholder="1990-01-01" {...field} />
                  </FormControl>
                  <FormDescription>This is your date of birth.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select {...field}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </FormControl>
                  <FormDescription>Please select your gender.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Bio" {...field} />
                  </FormControl>
                  <FormDescription>This is your bio.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      ) : (
        <div className="user-card border flex flex-col gap-5 p-3">
          <div>
            {userDetail && (
              <Image
                src={userDetail.avatar}
                alt="avatar"
                width={50}
                height={50}
              />
            )}
          </div>
          <div>
            <strong>Full Name:</strong> {userDetail?.fullName || ""}
          </div>
          <div>
            <strong>Email:</strong> {userDetail?.email || ""}
          </div>
          <div>
            <strong>Gender:</strong> {userDetail?.gender || ""}
          </div>
          <div>
            <strong>Date of Birth:</strong> {userDetail?.dateOfBirth || ""}
          </div>
          <div>
            <strong>Bio:</strong> {userDetail?.bio || ""}
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </div>
      )}

      {roles.includes("GUIDE") && (
        <div className="p-5">
          <h1 className="text-[40px] font-bold">Your Guide Details:</h1>

          <div className="flex flex-col  justify-between">
            <h1 className=" text-[26px] font-bold">
              Change your Availibility status
            </h1>
            <p>people can&apos;t hire you when you are unavailable</p>
            <span
              className={`text-sm ${
                enrollAdventure?.isAvailable ? "text-green-500" : "text-red-500"
              }`}
            >
              {enrollAdventure?.isAvailable ? "available" : "not avaibale"}
            </span>
            <Switch
              checked={enrollAdventure?.isAvailable}
              onCheckedChange={changeAvailble}
            />
          </div>

          <h1 className="text-[26px] font-bold mt-3">Enrolled Adventures:</h1>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 p-6 w-full">
            {enrollAdventure?.adventures.map((adventure) => {
              return (
                <Card className="w-[500px]" key={adventure._id}>
                  <Image
                    src={adventure.imageUrl}
                    alt={adventure.imageAlt}
                    width={500}
                    height={500}
                  />
                  <CardHeader>
                    <CardTitle>{adventure.title}</CardTitle>
                    <CardDescription>{adventure.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p></p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="mt-2"
                      onClick={() => {
                        unenrollAdventure(adventure._id);
                      }}
                    >
                      Unenroll
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
