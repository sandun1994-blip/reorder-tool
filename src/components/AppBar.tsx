import Link from "next/link"
import SignInButton from "./SignInButton"
import Image from "next/image"
import { Sidebar } from "./sidebar"


type Props = {}

const AppBar = (props: Props) => {
  return (
   
<div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
  <Sidebar/>
</div>
    
  )
}

export default AppBar



{/* <header className="flex gap-4 p-4  from-white to gray-200 shadow-xl">
      <div >
        <Image alt="gx logo" src='/DynamicsGex_Header.png'
         width={70}
         height={50}/>
      </div>
        <Link className="transition-colors hover:text-blue-500" href={'/'}>
            Home 
        </Link>

        <Link className="transition-colors hover:text-blue-500" href={'/main/reorder-tool'}>
           Stock-Requirement
        </Link>
        <SignInButton />
    </header> */}