import styles from '../corso.module.scss'
import { Page, PageMain, PageSide, SideNav, Video, Button } from '/components/UI'
import Link from 'next/link'


const Unit = ({course, unit}) => {
    const anchors = [
        {id:'intro', label:'Intro'}
    ]

    unit.unit_meta.lessons.map((lesson, i) => {
        anchors.push({
            id: `lesson-${i+1}`,
            label: lesson.title
        })
    })


    return(
        <Page>
            <PageMain>
                <div className="pt-8 mb-12" id="intro">
                    <div className="mb-4">
                        <Link href={`/course/${course.slug}`} className="text-[14px] text-[#757575]">{course.title}</Link>
                    </div>
                    <h1 className="text-[32px] font-semibold mb-12">{unit.title}</h1>
                    <div dangerouslySetInnerHTML={{__html: unit.unit_meta.unitDescription}}></div>
                </div>
                <div>
                {
                    unit.unit_meta.lessons.map((lesson, i) => {
                        return(
                            <div key={i} className="mb-12" id={`lesson-${i+1}`}>
                                <h3 className="text-[22px] font-semibold mb-4 flex items-end">
                                    <span className="flex-1">{lesson.title}</span>
                                    <span className="font-normal text-[12px] text-[#757575]">{lesson.duration}</span>
                                </h3>
                                {lesson.video &&(
                                    <div className="mb-4"><Video id={lesson.video} /></div>
                                )}
                                <div dangerouslySetInnerHTML={{__html: lesson.description}}></div>
                            </div>
                        )
                    })
                }
                </div>
                <div className="mt-32">
                    <Button href={`/course/${course.slug}`}>Ritorna al corso</Button>
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

export default Unit

export async function getServerSideProps(context){

    async function getCourse(){
        const res = await fetch('https://frank-studio.com/intranet/graphql',{
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                query: `
                    query SinglePost($id: ID!){
                        course(id: $id, idType: URI){
                            databaseId
                            title
                            slug
                        }
                    }
                `,
                variables: {
                    id: context.params.all[0]
                }
            })
        })

        const json = await res.json()

        return json
    } 
    
    async function getUnit(courseId){
        const res = await fetch('https://frank-studio.com/intranet/graphql',{
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                query: `
                    query SinglePost($name: String!, $parent: ID!){
                        courses(where: {name: $name, parent: $parent}){
                            nodes{
                                id
                                databaseId
                                title
                                slug
                                unit_meta {
                                    unitDuration
                                    unitDescription
                                    lessons {
                                        title
                                        duration
                                        video
                                        description
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: {
                    name: context.params.all[1],
                    parent: courseId
                }
            })
        })

        const json = await res.json()

        return json
    }
    const course = await getCourse()
    const unit = await getUnit(course.data.course.databaseId)


    return{
        props: {
            course: course.data.course,
            unit: unit.data.courses.nodes[0]
        }
    }
}