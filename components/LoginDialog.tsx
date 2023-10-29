import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog as DialogShadCn,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldErrors = {
  [key: string]: string;
};

import { sendOtp } from "@/lib/auth";
function LoginDialog() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    try {
      await sendOtp(phoneNumber);
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

  return (
    <DialogShadCn>
      <DialogTrigger>
        <div className="text-sm font-semibold leading-6 text-gray-900">
          Login
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
              <div className="text-red-500 mt-2">{fieldErrors.phoneNumber}</div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
        <hr className="my-4" />
        <div className="text-center">
          <DialogDescription>
            <a href="#">Forgot password?</a>
          </DialogDescription>
        </div>
      </DialogContent>
    </DialogShadCn>
  );
}

export default LoginDialog;
