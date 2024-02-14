"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnrollAdventure } from "@/api/adventures";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer";

export default function EnrollAdventureDialog({ id }: { id: string }) {
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const { roles,  } = useSelector((state: RootState) => state.users);

  const handleEnroll = async () => {
    try {
      await EnrollAdventure({
        adventureId: id,
        accessToken,
      });
      setOpenEnrollDialog(false);
      setOpenMessageDialog(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className={`${isAuthenticated && roles.includes("GUIDE") ? "flex" : "hidden"} items-center space-x-2`}>
      <Dialog open={openEnrollDialog} onOpenChange={setOpenEnrollDialog}>
        <DialogTrigger asChild>
          <Button>Enroll To Adventure</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
          <DialogHeader>
            <DialogDescription>
              You will now be enrolled to this adventure. Are you sure you want
              to continue?
            </DialogDescription>
            <Button
              className="mt-2"
              onClick={() => {
                handleEnroll();
              }}
            >
              Yes, Enroll.
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openMessageDialog} onOpenChange={setOpenMessageDialog}>
        <DialogContent>
          <DialogTitle>Successfully enrolled to adventure</DialogTitle>
          <DialogHeader>
            <DialogDescription>
              You have been successfully enrolled to this adventure. You will
              receive a message shortly.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
