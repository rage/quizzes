import React from "react"
import { NextPage } from "next"
import { fetchCourseQuizzes } from "../../services/quizzes"
import { CourseListQuiz } from "../../types/Quiz"

import { get, groupBy } from "lodash"
import { Typography, Card, CardContent } from "@material-ui/core"
import DebugDialog from "../../components/DebugDialog"
import styled from "styled-components"
import Link from "next/link"

interface ShowCoursePageProps {
  id: string
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

const ShowCoursePage = ({ quizzes, id }: ShowCoursePageProps) => {
  const name =
    get(quizzes, "[0].course.texts[0].title") || `Unknown course ${id}`
  const byPart = groupBy(quizzes, "part")
  return (
    <>
      <Typography variant="h3">Edit {name}</Typography>
      {Object.entries(byPart).map(([part, quizzes]) => (
        <div key={part}>
          <Typography variant="h5">Part {part}</Typography>
          {quizzes.map(quiz => {
            const title = get(quiz, "texts[0].title") || quiz.id
            return (
              <Link
                key={quiz.id}
                href="/quizzes/[id]/edit"
                as={`/quizzes/${quiz.id}/edit`}
              >
                <QuizLink>
                  <QuizCard>
                    <CardContent>{title}</CardContent>
                  </QuizCard>
                </QuizLink>
              </Link>
            )
          })}
        </div>
      ))}
      <DebugDialog data={quizzes} />
    </>
  )
}

export default ShowCoursePage

ShowCoursePage.getInitialProps = async (ctx: any) => {
  // TODO: ideally this should fetch course details, not quiz details
  const id: string = ctx.query.id.toString()
  const quizzes = await fetchCourseQuizzes(id)
  return {
    id,
    quizzes,
  }
}
