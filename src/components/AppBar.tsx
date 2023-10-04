import Link from "next/link"
import SignInButton from "./SignInButton"


type Props = {}

const AppBar = (props: Props) => {
  return (
    <header className="flex gap-4 p-4  from-white to gray-200 shadow-xl">
        <Link className="transition-colors hover:text-blue-500" href={'/'}>
            Home Page
        </Link>

        <Link className="transition-colors hover:text-blue-500" href={'/main/reorder-tool'}>
           DashBoard
        </Link>
        <SignInButton />
    </header>
  )
}

export default AppBar