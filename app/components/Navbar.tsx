"use client";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import React, { FC } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ADMIN_MENU_ITEMS, MENU_ITEMS } from "../constant/menu-item";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Menu: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const menuItems = isAdmin ? ADMIN_MENU_ITEMS : MENU_ITEMS;
  return (
    <>
      {menuItems.map((item, idx) => (
        <div key={item.href} className="w-[90%] mx-auto">
          <a
            href={item.href}
            className="block px-4 py-2 text-md text-gray-700 hover:bg-amber-100 text-left"
          >
            {item.label}
          </a>
          {idx < menuItems.length - 1 && <Separator className="mx-auto w-2" />}
        </div>
      ))}
    </>
  );
};

const Navbar: FC = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="sticky top-0 z-50 bg-amber-50 text-amber-950 shadow-md backdrop-blur-sm">
      <div className="relative flex items-center justify-between p-4">
        <div className="text-xl font-bold">🐱 Cat Rescue</div>

        <Bars3BottomRightIcon
          className="w-10 cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        />

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 12,
              }}
              style={{ transformOrigin: "top" }}
              className="absolute right-0 top-full w-52 bg-amber-50 shadow-xl rounded-b-xl overflow-hidden"
            >
              <div className="py-2">
                {status === "authenticated" && (
                  <div className="flex p-2">
                    <div className="px-4 py-2 text-md text-gray-700">
                      Welcome, {session?.user?.username}
                    </div>
                    <Button variant="outline" onClick={() => signOut()}>
                      Logout
                    </Button>
                  </div>
                )}

                <Menu isAdmin={status === "authenticated" ? true : false} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
