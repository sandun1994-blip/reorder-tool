import { Sidebar } from "@/components/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition dark:bg-slate-950">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white dark:bg-slate-950">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
