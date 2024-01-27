"use client";
import { Adventure, UnenrollAdventure } from "@/api/adventures";
import { UserProfile, getMe, profile } from "@/api/users";
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

function Page() {
  const [userDetail, setUserDetail] = useState<UserProfile>();
  const [enrollAdventure, setEnrollAdventure] = useState<Adventure[]>([]); // [adventureId
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { roles } = useSelector((state: RootState) => state.users);

  async function getEnrolledAventure(accessToken: string) {
    const response = await getMe(accessToken);
    setEnrollAdventure(response.adventures);
  }

  async function getUserDetail(accessToken: string) {
    const response = await profile(accessToken);
    setUserDetail(response);
  }

  useEffect(() => {
    // getUserDetail(accessToken);
    getEnrolledAventure(accessToken);
  }, []);

  async function unenrollAdventure(id: string) {
    await UnenrollAdventure({ adventureId: id, accessToken: accessToken });
    getEnrolledAventure(accessToken);
  }
  console.log(userDetail);

  // State to manage user data
  const [isEditing, setIsEditing] = useState(true);

  return (
    <>
      {roles.includes("GUIDE") && (
        <>
          <h1 className="text-[40px] font-bold">Enrolled Adventures:</h1>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 p-6 w-full">
            {enrollAdventure.map((adventure) => {
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
        </>
      )}
    </>
  );
}

export default Page;
