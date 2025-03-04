import { useRouter } from 'next/router'
import {useEffect, useContext, useState, useRef} from 'react'
import AuthContext from "/context/AuthContext"
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Input = dynamic(() => import('/components/UI').then(mod => mod.Input))

export default function Index() {
     
    const { user, login } = useContext(AuthContext);
    const root = useRef()
    const router = useRouter()
    const [errorDisplay, setErrorDisplay] = useState('hidden')


    useEffect(() => {
        if(user){
            router.push('/home')
        }
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()
        setErrorDisplay('hidden')
        const email = root.current.querySelector('[name="email"]').value
        const password = root.current.querySelector('[name="password"]').value

        login({email: email, password: password}).then(data=>{
            if(data.json.success){
                window.location = '/home'
              } else {
                setErrorDisplay('block')
              }
        })
    }

    const onChange = () => {
        setErrorDisplay('hidden')
    }

    if(!user){
        return(
            <div ref={root} className="full-screen flex items-center justify-center text-center">
                <div className="container">
                    <div className="w-[300px] inline-block -mt-[64px]">
                        <h3 className="font-semibold text-[22px] mb-8">Sign in</h3>
                        <form action="#">
                            <div className="mb-5">
                                <Input name="email" type="text" placeholder="Email" onChange={onChange}/>
                            </div>
                            <div className="mb-5">
                                <Input name="password" type="password" placeholder="Password" onChange={onChange}/>
                            </div>
                            <div className="mb-5">
                                <button className="bg-black py-3 text-white rounded-lg block w-full" onClick={(e)=>{onSubmit(e)}}>Sign In</button>
                            </div>
                            <div className={errorDisplay}>
                                <p className="text-red-500 font-semibold text-[14px]">I dati inseriti non sono corretti.</p>
                            </div>
                            <div className="mt-8">
                                <Link href="/recupera-password">Forgot your password?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}