"use client";

import { use, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

import LoginDialog from "./LoginDialog";
import UserNav from "./UserNav";
import { RootState } from "@/redux/reducer";
import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/api/users";
import { logout } from "@/redux/features/auth-slice";

const navigation = [{ name: "Adventures", href: "#" }];

interface CallToAction {
  name: string;
  href: string;
  icon: any;
}

const callsToAction: CallToAction[] = [
  { name: "Become a guide", href: "/guide-requests", icon: PlusCircleIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const { roles } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    async function checkJWT(token: string) {
      const res = await getMe(token);
      if (res.expire) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "roles=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        dispatch(logout());
        // window.location.href = "/";
        return;
      }
      return;
    }
    checkJWT(accessToken);
  }, []);

  return (
    <header>
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/">
            <Image
              src="/images/logo_small.png"
              alt="logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:items-center lg:justify-end lg:flex-1 lg:gap-x-12">
          {isAuthenticated &&
            !roles.includes("GUIDE") &&
            callsToAction.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800"
              >
                <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                {item.name}
              </a>
            ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isAuthenticated ? <UserNav /> : <LoginDialog />}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/images/logo_small.png"
                alt="logo"
                width={40}
                height={40}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                {isAuthenticated ? <UserNav /> : <LoginDialog />}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
