"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { Mail } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import {
  Dialog as DialogShadCn,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldErrors = {
  [key: string]: string;
};

import { sendOtp, createJWT, getGoogleAuthUrl } from "@/api/auth";
import { getMe } from "@/api/users";
import { loginSuccess } from "@/redux/features/auth-slice";
import { setUser } from "@/redux/features/users-slice";

function LoginDialog({buttonText}:{buttonText?:string}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpDialogfieldErrors, setOtpDialogfieldErrors] = useState<{
    [key: string]: string;
  }>({});
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string>("");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGoogleAuthUrl = async () => {
      try {
        const { authorization_url } = await getGoogleAuthUrl();
        setGoogleAuthUrl(authorization_url);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoogleAuthUrl();
  }, []);

  const handleRequestOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    try {
      await sendOtp(phoneNumber);
      setOpenPhoneDialog(false);
      setOpenOtpDialog(true);
    } catch (errors) {
      if (errors instanceof Error) {
        const err = errors as Error;
        setErrorMessage(err.message);
      } else {
        if (typeof errors === "object" && errors !== null) {
          const err = errors as FieldErrors;
          const dynamicErrors: { [key: string]: string } = {};
          for (const key in err) {
            if (Object.prototype.hasOwnProperty.call(err, key)) {
              dynamicErrors[key] = err[key];
            }
          }
          setFieldErrors(dynamicErrors);
        }
      }
    }
  };

  const handleVerifyOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setOtpDialogfieldErrors({});

    try {
      const { accessToken, refreshToken } = await createJWT({
        phoneNumber,
        code: otpCode,
        method: "phone",
      });

      const user = await getMe(accessToken);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      document.cookie = `accessToken=${accessToken}`;
      document.cookie = `roles=${user.roles}`;
      setOpenOtpDialog(false);
      dispatch(
        loginSuccess({
          accessToken,
          refreshToken,
        })
      );
      dispatch(
        setUser({
          phoneNumber: user.phoneNumber,
          username: user.username,
          roles: user.roles,
        })
      );
    } catch (errors) {
      if (errors instanceof Error) {
        const err = errors as Error;
        setErrorMessage(err.message);
      } else {
        if (typeof errors === "object" && errors !== null) {
          const err = errors as FieldErrors;
          const dynamicErrors: { [key: string]: string } = {};
          for (const key in err) {
            if (Object.prototype.hasOwnProperty.call(err, key)) {
              dynamicErrors[key] = err[key];
            }
          }
          setOtpDialogfieldErrors(dynamicErrors);
        }
      }
    }
  };

  return (
    <>
      <DialogShadCn open={openPhoneDialog} onOpenChange={setOpenPhoneDialog}>
        <DialogTrigger>
          <div className="text-sm font-semibold leading-6 text-gray-900">
            {buttonText ? buttonText : "Login"}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get Started!</DialogTitle>
            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}
          </DialogHeader>
          <form onSubmit={handleRequestOTPSubmit}>
            <div className="grid gap-4 py-4">
              <Label htmlFor="name" className="text-left">
                Phone Number
              </Label>
              <Input
                id="name"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
              />
              {fieldErrors.phoneNumber && (
                <div className="text-red-500 mt-2">
                  {fieldErrors.phoneNumber}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              Next
            </Button>
          </form>
          <hr className="my-4" />
          <div className="text-center">
            <Link
              className={buttonVariants({ variant: "default" })}
              href={googleAuthUrl}
            >
              <Mail className="mr-2 h-4 w-4" /> Login With Google
            </Link>
          </div>
        </DialogContent>
      </DialogShadCn>

      <DialogShadCn open={openOtpDialog} onOpenChange={setOpenOtpDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify your phone!</DialogTitle>
            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}
          </DialogHeader>
          <form onSubmit={handleVerifyOTPSubmit}>
            <div className="grid gap-4 py-4">
              <Label htmlFor="name" className="text-left">
                6 Digit OTP Code
              </Label>
              <Input
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="col-span-3"
              />
              {otpDialogfieldErrors.code && (
                <div className="text-red-500 mt-2">
                  {otpDialogfieldErrors.code}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
          <hr className="my-4" />
          <div className="text-center">
            <Link
              className={buttonVariants({ variant: "default" })}
              href={googleAuthUrl}
            >
              <Mail className="mr-2 h-4 w-4" /> Login With Google
            </Link>
          </div>
        </DialogContent>
      </DialogShadCn>
    </>
  );
}

export default LoginDialog;