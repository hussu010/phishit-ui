"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnrollAdventure, UnenrollAdventure } from "@/api/adventures";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer";
import { getMe, profile } from "@/api/users";

export default function EnrollAdventureDialog({ id }: { id: string }) {
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [openUnerollDialog, setOpenUnenrollDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openUnenrollMessageDialog, setOpenUnerollMessageDialog] =
    useState(false);
  const [enrollAdventure, setEnrollAdventure] = useState(false);
  const { roles } = useSelector((state: RootState) => state.users);

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
  const handleUnenroll = async () => {
    try {
      await UnenrollAdventure({
        adventureId: id,
        accessToken,
      });
      setOpenUnenrollDialog(false);
      setOpenUnerollMessageDialog(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };
  useEffect(() => {
    async function getAdventures() {
      const res = await getMe(accessToken);
      res.adventures.map((adventure: any) => {
        if (adventure._id === id) {
          setEnrollAdventure(true);
        }
      });
    }
    getAdventures();
  }, []);

  return (
    <>
      <div
        className={`${
          isAuthenticated && roles.includes("GUIDE") && !enrollAdventure
            ? "flex"
            : "hidden"
        } items-center space-x-2`}
      >
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
                You will now be enrolled to this adventure. Are you sure you
                want to continue?
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
      <div
        className={`${
          isAuthenticated && roles.includes("GUIDE") && enrollAdventure
            ? "flex"
            : "hidden"
        } items-center space-x-2`}
      >
        <Dialog open={openUnerollDialog} onOpenChange={setOpenUnenrollDialog}>
          <DialogTrigger asChild>
            <Button>Unenroll To Adventure</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}
            <DialogHeader>
              <DialogDescription>
                You will now be unenrolled to this adventure. Are you sure you
                want to continue?
              </DialogDescription>
              <Button
                className="mt-2"
                onClick={() => {
                  handleUnenroll();
                }}
              >
                Unenroll
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openUnenrollMessageDialog}
          onOpenChange={setOpenUnerollMessageDialog}
        >
          <DialogContent>
            <DialogTitle>Successfully uenrolled to adventure</DialogTitle>
            <DialogHeader>
              <DialogDescription>
                You have been successfully uenrolled to this adventure. You will
                receive a message shortly.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
