import { Adventure } from "@/api/adventures";
import { getUserByName } from "@/api/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

async function page({ params }: { params: { user: string } }) {
  const res = await getUserByName(params.user);

  console.log(res);

  return (
    <div className="flex items-center justify-center flex-col gap-6 min-h-[70vh]">
      {Object.keys(res).length === 0 ? (
        <div>
          No user name <span>{params.user}</span>
        </div>
      ) : (
        <Card className="w-1/2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-[30px]">
                  {res.user.username}
                </CardTitle>
                <CardDescription>{res.user._id}</CardDescription>
              </div>
              {res.profile && (
                <img
                  src={res.profile.avatar}
                  alt="user"
                  width={75}
                  height={75}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {res.profile ? (
              <>
                <p>Full Name: {res.profile.fullName}</p>
                <p>Bio: {res.profile.bio}</p>
                <p>Gender: {res.profile.gender}</p>
              </>
            ) : (
              <p>Profile not found</p>
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      )}
      {res.adventures.length && (
        <>
          <div className="text-[20px] font-bold">Enrolled Adventures</div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 p-6 w-full">
            {res.adventures.map((adventure: Adventure) => {
              return (
                <Card className="w-[300px]" key={adventure._id}>
                  <Image
                    src={adventure.imageUrl}
                    alt={adventure.imageAlt}
                    width={300}
                    height={300}
                  />
                  <CardHeader>
                    <CardTitle>{adventure.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                          <p className=" line-clamp-2">{ adventure.description}</p>
                  </CardContent>
                      <CardFooter>
                          <Link className="bg-black text-white p-4 rounded-[10px]" href={`/adventures/${adventure._id}`}>View Adventure</Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default page;
