"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}
export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        `rounded-xl flex  gap-4 px-4 capitalize items-center gap-x-2 dark:text-white hover:scale-105 font-bold pl-6  m-1 text-gray-700 
         transition-all hover:text-slate-600 hover:bg-slate-300/20 `,
        isActive &&
          " bg-gradient-to-r from-blue-600 to-blue-400 text-white"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(`dark:text-white text-gray-700 font-medium`, isActive && "text-white")}
        />
        {label}
      </div>
      <div
        className={cn(
          `ml-auto opacity-0 border-2 border-sky-700 h-full transition-all`,
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};
