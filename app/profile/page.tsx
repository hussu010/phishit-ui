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
import { set } from "date-fns";

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
  const [userDetail, setUserDetail] = useState<UserProfile>();
  const [enrollAdventure, setEnrollAdventure] = useState<UserMe>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
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
    form.setValue("fullName", fullName);
    form.setValue("email", email);
    form.setValue("dateOfBirth", dateOfBirth);
    form.setValue("gender", gender);
    form.setValue("bio", bio);
    setUserDetail(res);
    setIsEditing(false);
  }

  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { roles } = useSelector((state: RootState) => state.users);

  async function getEnrolledAventure(accessToken: string) {
    const response = await getMe(accessToken);
    setEnrollAdventure(response);
  }

  async function getUserDetail(accessToken: string) {
    const response = await profile(accessToken);
    console.log(response);

    if (Object.keys(response).length === 0) {
      setIsEditing(false);
      return;
    }
    form.setValue("fullName", response.fullName || "");
    form.setValue("email", response.email || "");
    form.setValue(
      "dateOfBirth",
      response.dateofBirth ? response.dateOfBirth.spilt("T")[0] : ""
    );
    form.setValue("gender", response.gender || "OTHER");
    form.setValue("bio", response.gender || "");

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
  console.log(enrollAdventure);
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh]">
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 px-[50px] w-full max-w-[500px]"
          >
            <FormField
              defaultValue={userDetail?.fullName}
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
              defaultValue={userDetail?.email}
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
              defaultValue={userDetail?.dateOfBirth}
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
              defaultValue={userDetail?.gender}
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
              defaultValue={userDetail?.bio}
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
            <Button onClick={() => setIsEditing(false)} className="ml-2">
              Cancel
            </Button>
          </form>
        </Form>
      ) : (
        <Card className="w-[80%] min-w-[350px]">
          <CardHeader>
            <CardTitle className="flex justify-between w-full">
              {userDetail?.fullName || "edit profile to add name"}
              {userDetail && (
                <img
                  src={userDetail.avatar}
                  alt="avatar"
                  width={50}
                  height={50}
                />
              )}
            </CardTitle>
            <CardDescription>{userDetail?.email || ""} </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="w-1/2">
              Bio: <b>{userDetail?.bio || ""}</b>
            </p>
            <div className="flex flex-col gap-2">
              <p>
                Date of Birth:{" "}
                <b>{userDetail?.dateOfBirth?.split("T")[0] || ""}</b>
              </p>
              <p>
                Gender: <b>{userDetail?.gender || ""}</b>
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </CardFooter>
        </Card>
      )}

      {roles.includes("GUIDE") && (
        <div className="py-5 w-[80%]">
          <Card className="w-full min-w-[350px]">
            <CardHeader>
              <CardTitle className="flex justify-between w-full">
                Guide Details
                <div className="flex gap-3 flex-col justify-between items-center">
                  <h1 className=" text-[26px] font-bold">
                    Availibility status
                  </h1>

                  <Switch
                    checked={enrollAdventure?.isAvailable}
                    onCheckedChange={changeAvailble}
                  />
                  <span
                    className={`text-sm ${
                      enrollAdventure?.isAvailable
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {enrollAdventure?.isAvailable
                      ? "available"
                      : "not avaibale"}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between"></CardContent>
            <CardFooter></CardFooter>
          </Card>
          <h1 className="text-[26px] font-semibold mt-3 text-center border-y-black border-y">
            Enrolled Adventures
          </h1>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 p-6 w-full">
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
    </div>
  );
}

export default Page;
