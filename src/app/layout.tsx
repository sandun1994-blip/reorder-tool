import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppBar from "@/components/AppBar";

import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/theme-provider";
import ToasterContext from "@/context/ToasterContext";
import Mainbar from "@/components/Mainbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dynamics GX",
  description: "Generated by ONESYS",
  
 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={cn(inter.className,'dark:bg-[#F5F6F8] bg-[#F5F6F8]')}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToasterContext />
            {/* <AppBar /> */}
                <Mainbar childrenMain={children}/>
            
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
