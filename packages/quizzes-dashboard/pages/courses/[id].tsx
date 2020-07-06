import React from "react"
import { fetchCourseQuizzes } from "../../services/quizzes"
import { groupBy, Dictionary } from "lodash"
import { Typography, Card, CardContent } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import DebugDialog from "../../components/DebugDialog"
import Link from "next/link"
import styled from "styled-components"
import useSWR from "swr"
import { withRouter } from "next/router"
import { Quizv2 } from "../../types/Quizv2"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"

interface quiz {
  quiz: Quizv2
}

interface section {
  section: string
  quizzes: Quizv2[]
}

const QuizCard = styled(Card)`
  margin-bottom: 1rem;
`

const QuizLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`
const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`
const ShowCoursePage = ({ router }: any) => {
  const id = router.query.id
  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    { label: "Course" },
  ])
  const { data, error } = useSWR(id, fetchCourseQuizzes)
  if (error) {
    return <div>Something went wrong</div>
  }
  if (!data) {
    return (
      <>
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
      </>
    )
  }
  const quizzes = data.quizzes
  const course = data.course
  const byPart = groupBy(quizzes, "part")
  let byPartAndSection: Record<string, Dictionary<Quizv2[]>> = {}
  for (let [part, quizzes] of Object.entries(byPart)) {
    byPartAndSection[part] = groupBy(quizzes, "section")
  }
  return (
    <>
      <Typography variant="h3">Edit {course.title}</Typography>
      {Object.entries(byPartAndSection).map(([part, section]) => (
        <div key={part}>
          <Typography variant="h4">Part {part}</Typography>
          {Object.entries(section).map(([section, quizzes]) => {
            return (
              <SectionOfPart
                key={part + "-" + section}
                section={section}
                quizzes={quizzes}
              />
            )
          })}
        </div>
      ))}
      <DebugDialog />
    </>
  )
}

const SectionOfPart = ({ section, quizzes }: section) => {
  return (
    <>
      <Typography variant="h6">Section {section}</Typography>
      {quizzes.map(quiz => {
        return <Quiz key={quiz.id} quiz={quiz} />
      })}
    </>
  )
}

const Quiz = ({ quiz }: quiz) => {
  const title = quiz.title
  return (
    <Link
      href={{ pathname: "/quizzes/[id]/edit", query: { id: `${quiz.id}` } }}
      as={`/quizzes/${quiz.id}/edit`}
    >
      <QuizLink>
        <QuizCard>
          <CardContent>
            <div>
              <Typography display="block" color="inherit" variant="body1">
                {title}
              </Typography>
            </div>
            <div>
              <Typography variant="overline" color="secondary">
                [{quiz.items[0].type}]
              </Typography>
            </div>
          </CardContent>
        </QuizCard>
      </QuizLink>
    </Link>
  )
}

export default withRouter(ShowCoursePage)
