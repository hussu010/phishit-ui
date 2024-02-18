import Link from "next/link";
import React from "react";
import Logo from "@/public/images/logo_small.png";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-black p-8">
      <div className="flex justify-around py-6">
        <h1 className="text-white font-bold text-2xl">Phis.it</h1>

        <div className="flex gap-1 flex-col">
          <h1 className="text-white">Product</h1>
          <ul className=" text-gray-400 flex flex-col gap-3">
            <li>
              <Link href="/bookings">Bookings</Link>
            </li>
            <li>
              <Link href="/adventures">Adventures</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex gap-5 justify-center">
        <ul className="text-gray-400 flex gap-4">
          <li>Help</li>
          <li>
            <Link href="/terms-and-conditions">Terms of Service</Link>
          </li>
          <li>
            <Link href="/privacy-policy">Privasy Policy</Link>
          </li>
          <li>Nepal Privacy Policy</li>
        </ul>
        <p className="text-gray-400">
          &copy; 2024 Phisit.it, All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
