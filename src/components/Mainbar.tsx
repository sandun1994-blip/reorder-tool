"use client";
import { Navbar } from "@/app/main/_components/navbar";
import React, { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  childrenMain: ReactNode;
};

const Mainbar = ({ childrenMain }: Props) => {
  const [menuVisible, setMenuVisible] = useState(true);
  return (
    <>
      <div className={cn(`h-[80px]  `, menuVisible && "md:pl-80")}>
        <Navbar setMenuVisible={setMenuVisible} />
      </div>
      {menuVisible && (
        <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50 ">
          <Sidebar />
        </div>
      )}
      <div className="h-full ">
        <main className={cn(`h-full`, menuVisible && "md:pl-72")}>
          {childrenMain}
        </main>
      </div>
    </>
  );
};

export default Mainbar;
