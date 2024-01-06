"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EnrollAdventureDialog() {
  //   const handleEnroll = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/api/adventures/${id}/enroll`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         body: JSON.stringify({ packageId: currentPackage._id }),
  //       });

  //       if (!res.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Enroll To Adventure</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
        <DialogHeader>
          <DialogDescription>
            You will now be enrolled to this adventure. Are you sure you want to
            continue?
          </DialogDescription>
          <Button
            className="mt-2"
            onClick={() => {
              //   handleEnroll({
              //     id: guideRequest._id,
              //     status: "REJECTED",
              //   });
            }}
          >
            Yes, Enroll.
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
