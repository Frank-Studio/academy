import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
const RouteHandler = ({children}) => {
    const root = useRef()
    const router = useRouter()

    const handleStart = () =>{
        gsap.to(root.current,{
            opacity: 0,
            y: 20
        })
    }

    const handleComplete = () =>{
        gsap.to(root.current,{
            opacity: 1,
            y: 0,
            delay: .5
        })

    }

    useEffect(() => {
        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)

        document.querySelector('body').classList.remove('is-dark')

        if(router.pathname === '/home'){
            document.querySelector('body').classList.add('is-dark')
        }

        return(()=>{
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)

        })
    }, [router.pathname])

    return (
        <div ref={root}>{children}</div>
    )
}

export default RouteHandler