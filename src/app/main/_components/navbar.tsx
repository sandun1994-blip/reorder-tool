import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";
import { Menu } from "lucide-react";

interface NavbarProp {
  setMenuVisible:React.Dispatch<React.SetStateAction<boolean>>
}
export const Navbar = ({setMenuVisible}:NavbarProp) => {
  return (
    <div className="p-4 border-b h-full flex items-center   w-full     px-2 sm:px-4 py-2.5  pt-4 bg-white rounded-lg shadow-md ">
      <div className="hidden md:flex cursor-pointer hover:text-black text-gray-700 font-bold" onClick={()=>setMenuVisible((pre: boolean)=>!pre)}>
      <Menu className="z-[500]"  />
      </div>
       
        <MobileSidebar/>
        <NavbarRoutes/>
     </div>
  );
};
