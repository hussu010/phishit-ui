"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Navbar from "@/components/Navbar";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { GuideRequestProps } from "@/config/types";
import { API_URL } from "@/config/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/redux/reducer";
import { getGuideRequests } from "@/api/guide-requests";
import { Textarea } from "@/components/ui/textarea";

export default function Adventures() {
  const [guideRequests, setGuideRequests] = useState<GuideRequestProps[]>([]);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    async function getAllGuideRequests(accessToken: string) {
      const guideRequests = await getGuideRequests(accessToken);
      setGuideRequests(guideRequests);
    }
    getAllGuideRequests(accessToken);
  }, []);

  const handleGuideRequestApproval = async ({
    id,
    status,
    message,
  }: {
    id: string;
    status: string;
    message: string;
  }) => {
    try {
      const res = await fetch(`${API_URL}/api/guide-requests/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const updatedGuideRequest = await res.json();

      setGuideRequests((guideRequests) =>
        guideRequests.map((guideRequest) =>
          guideRequest._id === updatedGuideRequest._id
            ? updatedGuideRequest
            : guideRequest
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white min-h-[90vh]">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="guide-requests" className="space-y-4">
          <TabsList>
            <Link href="/admin/adventures">
              <TabsTrigger value="manage-adventures">
                Manage Adventures
              </TabsTrigger>
            </Link>
            <Link href="/admin/guide-requests">
              <TabsTrigger value="guide-requests">Guide Requests</TabsTrigger>
            </Link>
            <Link href="/admin/interactions">
              <TabsTrigger value="interactions">Recent Activities</TabsTrigger>
            </Link>
            <Link href="/admin/cancelled_bookings">
              <TabsTrigger value="cancelled_bookings">
                Cancelled Bookings
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        <section className="grid grid-rows gap-4">
          {guideRequests.map((guideRequest) => (
            <Card key={guideRequest._id}>
              <CardHeader></CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Name</span>
                    <span>{guideRequest.name}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Email</span>
                    <span>{guideRequest.email}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Phone</span>
                    <span>{guideRequest.phoneNumber}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Address</span>
                    <span>{guideRequest.address}</span>
                  </div>
                  <div className="col-span-full">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">Message</span>
                      <span>{guideRequest.message}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 w-full">
                    <span className="font-semibold">User Type</span>
                    <span>{guideRequest.type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {guideRequest.documents.map((document) => (
                    <div
                      key={document._id}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src={document.url}
                        alt={document.type}
                        width={200}
                        height={200}
                        className="object-cover mb-2"
                      />
                      <span className="font-semibold">{document.type}</span>
                    </div>
                  ))}
                </div>
                {}
                {guideRequest.status === "PENDING" && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Approve Guide</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Do you really want to accept this guide request?
                          </DialogTitle>
                          <DialogDescription>
                            <Button
                              className="mt-2"
                              variant="default"
                              onClick={() => {
                                handleGuideRequestApproval({
                                  id: guideRequest._id,
                                  status: "APPROVED",
                                  message:
                                    "Your guide request has been approved",
                                });
                              }}
                            >
                              Approve
                            </Button>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Reject</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogDescription>
                            This action cannot be undone. Are you sure you want
                            to reject this guide request.
                          </DialogDescription>
                          <Textarea
                            className="mt-2"
                            placeholder="Enter custom message (optional)"
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                          />
                          <Button
                            className="mt-2"
                            variant="destructive"
                            onClick={() => {
                              handleGuideRequestApproval({
                                id: guideRequest._id,
                                status: "REJECTED",
                                message:
                                  customMessage ||
                                  "Sorry!! Guide Request Rejected.",
                              });
                              setCustomMessage("");
                            }}
                          >
                            Yes, Reject.
                          </Button>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                {guideRequest.status === "APPROVED" && (
                  <span className="text-green-500">Approved</span>
                )}
                {guideRequest.status === "REJECTED" && (
                  <span className="text-red-500">Rejected</span>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
