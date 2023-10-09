'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

type Props = {};

const SignInButton = (props: Props) => {
  const { data: session } = useSession();

  // console.log(session);
  
  
  if (session && session.user)
    return (
      <div className="flex gap-4 ml-auto items-center ">
         <ThemeToggle className="mr-4 dark:bg-white" />
        <p className="text-sky-600 font-semibold capitalize">{session?.user.username}</p>
        <Link
          href={"/api/auth/signout"}
          className="flex font-semibold capitalize rounded gap-4 ml-auto p-2 text-red-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white"
        >
          Sign Out
        </Link>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto items-center ">
      <div className="">
      <ThemeToggle className="mr-4" />
      </div>
      
      <Link
        href={"/api/auth/signin"}
        className="flex font-semibold capitalize rounded gap-4 ml-auto p-2 text-red-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white"
      >
        Sign In
      </Link>

      {/* <Link
        href={"/signup"}
        className="flex gap-4 ml-auto  text-green-200 p-2 rounded"
      >
        Sign Up
      </Link> */}
    </div>
  );
};

export default SignInButton;
