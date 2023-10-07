import Link from "next/link";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";
import Image from "next/image";

export const Sidebar = () => {
  

  return (
    <aside
      className={`dark:bg-[#2E3B42]
     dark:translate-x-0 translate-x-0 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] 
     w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 bg-white border-r-2 shadow-xl`}
    >
      <div
        className={`relative border-b dark:border-white/20  border-blue-gray-50 `}
      >
        <Link href="/" className="flex items-center gap-10 py-5 px-8">
          <h6 className="dark:text-white text-black scroll-m-20 text-xl font-semibold tracking-tight ">
            Dynamics
          </h6>
        </Link>
      </div>

      <SidebarRoutes />
    </aside>
  );
};

{
  /* <div
      className="h-full border-r flex flex-col overflow-y-auto
     bg-white shadow-sm dark:bg-slate-700"
    >
      <div className="p-6 dark:bg-slate-700">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div> */
}
