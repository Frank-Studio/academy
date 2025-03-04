import { useRouter } from "next/router"
import {useRef, useContext, useState, useEffect} from 'react'
import AuthContext from "/context/AuthContext"
import {NEXT_URL} from '/config'
import { Input } from '/components/UI'
import Link from 'next/link'

export default function Page(){
    const { user } = useContext(AuthContext);
    const root = useRef()
    const router = useRouter()
    const [errorDisplay, setErrorDisplay] = useState('hidden')
    const [successDisplay, setSuccessDisplay] = useState('hidden')


    useEffect(() => {
        if(user){
            router.push('/home')
        }
    }, [])


    const onSubmit = async (e) => {
        e.preventDefault()
        const email = root.current.querySelector('[name="email"]').value
        const res = await fetch(`${NEXT_URL}api/passwordReset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email
            })
        })
        const json = await res.json()

        if(json.json.status){
            setSuccessDisplay('block')
        } else {
            setErrorDisplay('block')
        }
    } 

    const onChange = () => {
        setErrorDisplay('hidden')
        setSuccessDisplay('hidden')
    }


    if(!user){
        return(
            <div ref={root} className="full-screen flex items-center justify-center text-center">
                <div className="container">
                    <div className="w-[300px] inline-block -mt-[64px]">
                        <h3 className="font-semibold text-[22px] mb-8">Recover Password</h3>
                        <form action="#">
                            <div className="mb-5">
                                <Input name="email" type="text" placeholder="Email" onChange={onChange}/>
                            </div>
                            <div className="mb-5">
                                <button className="bg-black py-3 text-white rounded-lg block w-full" onClick={(e)=>{onSubmit(e)}}>Recover</button>
                            </div>
                            <div className={errorDisplay}>
                                <p className="text-red-500 font-semibold text-[14px]">I dati inseriti non sono corretti.</p>
                            </div>
                            <div className={successDisplay}>
                                <p className="text-green-500 font-semibold text-[14px]">Ti abbiamo inviato la nuova password alla email indicata.</p>
                            </div>
                            <div className="mt-8">
                                <Link href="/">Back to login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}