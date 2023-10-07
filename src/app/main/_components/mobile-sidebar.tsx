import { Sidebar } from "@/components/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition dark:text-[#2E3B42]">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-[345px] text-red-600 font-[900]">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
