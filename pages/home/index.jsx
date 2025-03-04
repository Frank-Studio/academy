import Link from 'next/link'
import { useContext, useState, useEffect } from 'react'
import AuthContext from "/context/AuthContext"
import { NEXT_URL } from "/config/index";

const Home = ({courses}) => {
    const { user } = useContext(AuthContext)
    const [loaded, setLoaded] = useState(false)
    const [totCourse, setTotCourse] = useState(courses.length)
    const [totCompletedCourse, setTotCompletedCourse] = useState(0)
    const [heroImage, setHeroImage] = useState('#')

    useEffect(() => {
        checkCourses().then((data) => {
            setTotCompletedCourse(data.totCompleted)

            for(let course in data.courses){
                courses.map((c) => {
                    if(c.databaseId == course){
                        c.completed = data.courses[course]
                    }
                })
            }

            setLoaded(true)
        })

        getHome().then((data) => {
            setHeroImage(data.hero_image)
        })
    }, [])

    const checkCourses = async () =>{
        const ids = []

        courses.map((course) => {
            ids.push(course.databaseId)
        })

        const res = await fetch(`${NEXT_URL}api/checkComplete`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: user.token,
                user_id: user.id,
                ids: ids
            })
        })

        const data = await res.json()

        return data.json
    }

    const getHome = async () =>{

        const res = await fetch(`${NEXT_URL}api/home`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
        })

        const data = await res.json()


        return data.json
    }


    return(
        <>
            <div className="min-h-screen text-white">
                <div className="container">
                    <div className="py-24 flex items-center -sm:block">
                        <div className="flex-1 pr-16 -sm:mb-16 -sm:pr-0">
                            <h3 className="text-[64px] -sm:text-[48px]"><strong className="block">Frank</strong>Academy</h3>
                            <p>Ciao <strong>{user.firstname} {user.lastname}!</strong><br />Hai completato {totCompletedCourse} corso su {totCourse}.</p>
                        </div>
                        <div className="max-w-[400px] -md:max-w-[200px] -sm:max-w-none text-center">
                            <img src={heroImage} alt="" className="w-full inline-block" />
                        </div>
                    </div>
                    <h2 className="text-[38px] font-semibold text-center mb-16">Corsi disponibili</h2>
                    <div className="grid grid-cols-3 gap-24 mb-52 -lg:gap-16 -lg:mb-40 -md:grid-cols-2 -md:gap-8 -sm:grid-cols-1 -sm:gap-16">
                        {courses.map((course, i) => {
                            return(
                                <div key={i}>
                                    <Link href={`/course/${course.slug}`}>
                                        <img src={course.meta.previewImage.mediaItemUrl} alt="" className="mb-3 w-full" />
                                    </Link>
                                    <h4 className="text-[22px] font-semibold mb-3">{course.title}</h4>
                                    <p dangerouslySetInnerHTML={{__html: course.meta.subtitle}} className="mb-3 text-[#757575] text-[14px]"></p>
                                    <p dangerouslySetInnerHTML={{__html: course.meta.excerpt}}></p>
                                    <div className="mt-6 font-semibold text-[22px]">
                                        {course.completed && loaded &&(
                                            <span className="text-green-500">Corso completato</span>
                                        )}
                                        {!course.completed && loaded &&(
                                            <span className="text-red-500">Corso non completato</span>
                                        )}
                                    </div>
                                </div>  
                            )
                        })}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Home

export async function getServerSideProps(context){
    async function getCourses(){
        const res = await fetch('https://frank-studio.com/intranet/graphql',{
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                query: `
                    query GetCourses{
                        courses(where: {parent: 0, orderby: {field: MENU_ORDER, order: ASC}}){
                            nodes{
                                id
                                databaseId
                                title
                                slug
                                meta{
                                    title
                                    subtitle
                                    excerpt
                                    previewImage{
                                        mediaItemUrl
                                    }
                                }
                            }
                        }
                    }
                `
            })
        })

        const json = await res.json()

        return json
    }

    
    const courses = await getCourses()
    return{
        props: {
            courses: courses.data.courses.nodes
        }
    }
}