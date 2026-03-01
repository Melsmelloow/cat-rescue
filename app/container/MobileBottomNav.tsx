"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cat, BookOpen } from "lucide-react";

function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Cats", href: "/cats/view", icon: Cat },
    { name: "Stories", href: "/stories/view", icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm md:hidden z-50">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center text-xs font-medium transition ${
                isActive
                  ? "text-amber-700"
                  : "text-zinc-500 hover:text-amber-600"
              }`}
            >
              <item.icon size={20} />
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
