"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { createJWT } from "@/api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/features/auth-slice";

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAccessTokenFromUrl = async () => {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const googleAccessToken = params.get("access_token");

      if (googleAccessToken) {
        const { accessToken, refreshToken } = await createJWT({
          code: googleAccessToken,
          method: "google",
        });

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(
          loginSuccess({
            accessToken,
            refreshToken,
          })
        );
        router.push("/");
      } else {
        console.error("Access Token not found in the URL");
      }
    };

    getAccessTokenFromUrl();
  }, []);

  return (
    <div>
      <Navbar />
      <Button>Click me</Button>
    </div>
  );
}
