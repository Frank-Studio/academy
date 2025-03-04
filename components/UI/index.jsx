import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ScrollspyNav from 'react-scrollspy-nav'

const Plyr = dynamic(() => import("plyr-react"), { ssr: false })
import "plyr-react/plyr.css"

export const Page = ({children}) => {
    return (
        <div className="container">
            <div className="flex">{children}</div>
        </div>
    )
}

export const PageMain = ({children}) => {
    return (
        <div className="flex-1 pr-60 pb-24 -2xl:pr-32 -lg:pr-0">{children}</div>
    )
}

export const PageSide = ({children}) => {
    return (
        <div className="w-[300px] border-l relative min-h-screen -lg:hidden">{children}</div>
    )
}

export const IconTitle = ({children, icon}) => {
    return (
        <div className="flex items-center">
            <img src={`/images/ico-${icon}.png`} alt="" className="w-[60px] h-auto mr-8 -sm:w-[40px] -sm:mr-4"/>
            <h4 className="text-[22px] font-semibold">{children}</h4>
        </div>
    )
}

export const Resources = ({data, mode}) => {
    return(
        <ul className="ml-24 mt-8 flex flex-wrap list-disc -sm:flex-col -sm:ml-16">
            {data.map((item,i) => {
                const url = (mode === 'url') ? item.url : item.file.mediaItemUrl
                return (
                    <li key={i} className="w-1/2 mb-4 -sm:w-full"><a href={url} target="_blank" className="underline" rel="noreferrer">{item.title}</a></li>
                )
            })}
            
        </ul>
    )
}

export const SideNav = ({anchors}) => {
    const nav = useRef()

    useEffect(() => {
        nav.current.querySelectorAll('[data-nav-link]')[0].classList.add('is-active')
    },[])

    const ids = []

    anchors.map((anchor) => {
        ids.push(anchor.id)
    })

    return(
        <ScrollspyNav
            scrollTargetIds={ids}
            offset={-110}
            activeNavClass="is-active"
            scrollDuration={200}
        >
            <ul className="-ml-[1px]" ref={nav}>
                {
                    anchors.map((anchor, i) => {
                        return(
                            <li key={i} className="mb-4">
                                <a href={`#${anchor.id}`} data-nav-link className="nav-link pl-4 font-semibold border-l block">{anchor.label}</a>
                            </li>
                        )
                    })
                }
            </ul>
        </ScrollspyNav>
    )
}

export const Video = ({id}) => {
    const player = useRef()

    const plyrProps = {
        source: {
            type: 'video',
            sources: [
                {
                    src: `https://vimeo.com/${id}`,
                    provider: 'vimeo'
                }
            ]
        }
    }

    return (
        <Plyr {...plyrProps} />
    )
}

export const Button = ({children, href}) => {
    return (
        <Link href={href} className="bg-black py-[14px] px-[20px] text-white rounded-lg">{children}</Link>
    )
}

export const Input = ({name, placeholder, type, onChange}) => {
    return (
        <input type={type} name={name} placeholder={placeholder} className="border border-slate-300 w-full bg-[#F8F7F8] py-2 px-4 rounded-lg" onChange={()=>{onChange()}} />
    )
}
