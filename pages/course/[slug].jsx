import styles from './corso.module.scss'
import AuthContext from "/context/AuthContext"
import { useState, useEffect, useContext } from 'react'
import { NEXT_URL } from "/config/index";
import { Page, PageMain, PageSide, IconTitle, Resources, SideNav, Video } from '/components/UI'
import Link from 'next/link'

const Corso = ({course, units}) => {
    const { user } = useContext(AuthContext)
    const [loaded, setLoaded] = useState(false)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        checkCourse().then((data) => {
            setCompleted(data.courses[course.databaseId])
            setLoaded(true)
        })
    }, [])

    const checkCourse = async () =>{
        const res = await fetch(`${NEXT_URL}api/checkComplete`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: user.token,
                user_id: user.id,
                ids: course.databaseId
            })
        })

        const data = await res.json()

        return data.json
    }


    const anchors = [
        {id:'intro',label:'Introduzione'}, 
        {id:'lessons',label:'Lezioni'}, 
        {id:'resources',label:'Risorse'}, 
    ]
    const extra = {
        videos: [{'Video':'#'},{'Video':'#'},{'Video':'#'},{'Video':'#'},{'Video':'#'}],
        materials: [{'Materiale':'#'},{'Materiale':'#'},{'Materiale':'#'},{'Materiale':'#'}],
        links: [{'Server Link':'#'},{'Server Link':'#'},{'Server Link':'#'},{'Server Link':'#'}]
    }

    const setCourseStatus = async () =>{
        setCompleted(!completed)

        const res = await fetch(`${NEXT_URL}api/setComplete`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: user.token,
                user_id: user.id,
                id: course.databaseId,
                set: !completed
            })
        })
    }

    return(
        <Page>
            <PageMain>
                <div id="intro" className="mb-24 pt-14 -md:mb-16">
                    <h1 className="text-[64px] font-semibold leading-none mb-8 -lg:text-[48px]">{course.meta.title}</h1>
                    <p className="text-sm text-[#757575] mb-12">{course.meta.subtitle}</p>
                    <div className="mb-6 flex items-center">
                        <div className="flex-1">
                            <span className="text-[19px] font-semibold">
                                {!completed && loaded &&(
                                    <span>&nbsp;</span>
                                    // <span className="text-red-500">Corso non completato</span>
                                )}

                                {completed && loaded &&(
                                    <span className="text-green-500">Corso completato</span>
                                )}
                            </span>
                        </div>
                        <button className="underline" onClick={()=>{setCourseStatus()}}>
                            {!completed && loaded &&(
                                <>Segna come completato</>
                            )}
                            {completed && loaded &&(
                                <>Segna come non completato</>
                                )}
                        </button>
                    </div>
                    <div className="mb-12 w-full">
                        {course.meta.video &&(
                            <Video id={course.meta.video} />
                        )}
                        {!course.meta.video &&(
                            <img src={course.meta.mainImage.mediaItemUrl} alt="" />
                        )}
                    </div>
                    <div className={styles.content} dangerouslySetInnerHTML={{__html: course.meta.description}}></div>
                </div>

                <div id="lessons" className="mb-24 -md:mb-16">
                    <h3 className="text-[32px] font-semibold mb-16">Lezioni</h3>
                    <ul>
                        {units.map((unit, i) =>{
                            return (
                                <li className="mb-16" key={i}>
                                    <div className="flex border-b mb-6 pb-3 items-baseline relative -sm:flex-col">
                                        <h4 className="text-[22px] font-semibold -sm:mb-2">{unit.title}</h4>
                                        <span className="flex-1 ml-4 text-[14px] text-[#757575] -sm:absolute -sm:top-[5px] -sm:right-0">{unit.unit_meta.unitDuration}</span>
                                        <Link href={`/course/${course.slug}/${unit.slug}`} className="underline">Entra nel modulo</Link>
                                    </div>
                                    <ul>
                                        {
                                            unit.unit_meta.lessons.map((lesson, e) =>{
                                                return(
                                                    <li className="mb-4" key={e}>
                                                        <Link href={`/course/${course.slug}/${unit.slug}/#lesson-${e+1}`} className="flex gap-4">
                                                            <img src="/images/ico-play.png" alt="" className="w-[24px] h-[24px]" />
                                                            {lesson.title}
                                                        </Link>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div id="resources" className="mb-24 -md:mb-16">
                    <h3 className="text-[32px] font-semibold mb-16">Risorse</h3>
                    {course.meta.tutorials &&(
                        <div className="mb-16 -md:mb-12">
                            <IconTitle icon="eye">Guarda extra tutorials</IconTitle>
                            <Resources data={course.meta.tutorials} mode="url" />
                        </div>
                    )}

                    {course.meta.materials &&(
                        <div className="mb-16 -md:mb-12">
                            <IconTitle icon="docs">Download materiali</IconTitle>
                            <Resources data={course.meta.materials} mode="file" />
                        </div>
                    )}

                    {course.meta.links &&(
                        <div className="mb-16 -md:mb-12">
                            <IconTitle icon="links">Server Links</IconTitle>
                            <Resources data={course.meta.links} mode="url" />
                        </div>
                    )}
                </div>
            </PageMain>
            <PageSide>
                <div className="sticky top-24 mt-8">
                    <SideNav anchors={anchors} />
                </div>
            </PageSide>
        </Page>
    )
}
export default Corso


export async function getServerSideProps(context){
    async function getCourse(){
        const res = await fetch('https://frank-studio.com/intranet/graphql',{
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                query: `
                    query SinglePost($id: ID!){
                        course(id: $id, idType: URI){
                            id
                            databaseId
                            title
                            slug
                            meta {
                              title
                              subtitle
                              description
                              video
                              mainImage{
                                mediaItemUrl
                              }
                              tutorials{
                                title
                                url
                              }
                              materials {
                                title
                                file {
                                  mediaItemUrl
                                }
                              }
                              links {
                                title
                                url
                              }
                            }
                        }
                    }
                `,
                variables: {
                    id: context.params.slug
                }
            })
        })
        const json = await res.json()
        return json
    }

    async function getUnits(corsoId){
        const res = await fetch('https://frank-studio.com/intranet/graphql',{
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
            query: `
                query Posts($id: ID!){
                    courses(where: {parent: $id, orderby:{field: MENU_ORDER, order: ASC}}){
                        nodes{
                            title
                            slug
                            parent{
                                node{
                                    databaseId
                                }
                            }
                            unit_meta{
                                unitDuration
                                lessons{
                                    title
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                id: corsoId
            }
            })
        })
        const json = await res.json()
        return json
    }  
    
    const course = await getCourse()

    const units = await getUnits(course.data.course.databaseId)

    return{
        props: {
            course: course.data.course,
            units: units.data.courses.nodes
        }
    }
}