"use client";
import { UnenrollAdventure } from "@/api/adventures";
import { getMe } from "@/api/users";
import { RootState } from "@/redux/reducer";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

function Page() {
  const [userDetail, setUserDetail] = useState<any>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const route = useRouter();
  useEffect(() => {
    async function getUserDetail(accessToken: string) {
      const response = await getMe(accessToken);
      setUserDetail(response);
    }
    getUserDetail(accessToken);
  }, []);

  function unenrollAdventure(id: string) {
    UnenrollAdventure({ adventureId: id, accessToken: accessToken });
    route.refresh();
  }
  console.log(userDetail);
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">My Profile</TabsTrigger>
        {userDetail && userDetail.roles.includes("GUIDE") && (
          <TabsTrigger value="enrollAdventure">Enrolled Adventure</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="enrollAdventure">
        <div className="grid grid-cols-3 p-6">
          {userDetail &&
            userDetail.adventures.map((adventure: any) => {
              return (
                <div key={adventure._id} className="group h-[300px] w-[300px]">
                  <h3 className="text-2xl">{adventure.title}</h3>
                  <div className=" w-[200px] overflow-hidden rounded-md bg-gray-200 h-[150px] lg:aspect-none group-hover:opacity-75 relative">
                    <Image
                      src={adventure.imageUrl}
                      alt={adventure.imageAlt}
                      height={200}
                      width={200}
                      className=""
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="mt-1 text-sm text-gray-500">
                        {adventure.description.length > 200
                          ? `${adventure.description.substring(0, 200)}...`
                          : adventure.description}
                      </p>
                      <Button onClick={() => unenrollAdventure(adventure._id)}>
                        Unenroll
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </TabsContent>
      <TabsContent value="profile">
        {userDetail && (
          <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-md md:max-w-2xl">
            <div className="md:flex">
              {/* <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:w-48"
            src="https://placekitten.com/200/300" // Replace with the actual user image URL
            alt="User Avatar"
          />
        </div> */}
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Roles:
                </div>
                <ul className="mt-2 leading-8">
                  {userDetail.roles.map((role: string, index: number) => (
                    <li key={index} className="list-disc">
                      {role}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <p className="text-gray-600">
                    Username: {userDetail.username}
                  </p>
                  <p className="text-gray-600">
                    Phone Number: {userDetail.phoneNumber}
                  </p>
                  <p className="text-gray-600">
                    Active: {userDetail.isActive ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-600">
                    Created At:{" "}
                    {new Date(userDetail.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    Updated At:{" "}
                    {new Date(userDetail.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default Page;
