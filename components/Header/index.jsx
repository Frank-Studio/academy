import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from "/context/AuthContext"

const Header = () => {
    const { user } = useContext(AuthContext)
    return(
        <div className="h-[64px] bg-black fixed top-0 left-0 w-full z-[99] flex items-center px-6">
            <div className="flex-1">
                <Link href="/home">
                    <img src="/images/logo-light.svg" alt="" className="w-20" />
                </Link>
            </div>
            {user &&(
                <div>
                    <Link href="/logout" className="text-white">Logout</Link>
                </div>
            )}
        </div>
    )
}

export default Header