import React from "react"
import { fetchCourseQuizzes } from "../../services/quizzes"
import { CourseListQuiz } from "../../types/Quiz"

import { get, groupBy, Dictionary } from "lodash"
import { Typography, Card, CardContent } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import DebugDialog from "../../components/DebugDialog"
import Link from "next/link"
import styled from "styled-components"
import useSWR from "swr"
import { withRouter } from "next/router"

interface quiz {
  quiz: CourseListQuiz
}

interface section {
  section: string
  quizzes: CourseListQuiz[]
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
  const { data, error } = useSWR(id, fetchCourseQuizzes)
  if (error) {
    return <div>Something went wrong</div>
  }
  if (!data) {
    return (
      <>
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
      </>
    )
  }
  const quizzes = data
  const name =
    get(quizzes, "[0].course.texts[0].title") || `Unknown course ${id}`
  const byPart = groupBy(quizzes, "part")
  let byPartAndSection: Record<string, Dictionary<CourseListQuiz[]>> = {}
  for (let [part, quizzes] of Object.entries(byPart)) {
    byPartAndSection[part] = groupBy(quizzes, "section")
  }
  return (
    <>
      <Typography variant="h3">Edit {name}</Typography>
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
  const title = get(quiz, "texts[0].title") || quiz.id
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
