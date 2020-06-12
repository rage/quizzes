import React from "react"
import { NextPage } from "next"
import { fetchCourseQuizzes } from "../../services/quizzes"
import { CourseListQuiz } from "../../types/Quiz"

import { get, groupBy, Dictionary } from "lodash"
import { Typography, Card, CardContent } from "@material-ui/core"
import DebugDialog from "../../components/DebugDialog"
import Link from "next/link"
import styled from "styled-components"

interface ShowCoursePageProps {
  id: string
  quizzes: CourseListQuiz[]
}

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

const ShowCoursePage = ({ quizzes, id }: ShowCoursePageProps) => {
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
              <>
                <SectionOfPart
                  key={part + section}
                  section={section}
                  quizzes={quizzes}
                />
              </>
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
      {quizzes.map((quiz) => {
        return (
          <>
            <Quiz key={quiz.id} quiz={quiz} />
          </>
        )
      })}
    </>
  )
}

const Quiz = ({ quiz }: quiz) => {
  const title = get(quiz, "texts[0].title") || quiz.id
  return (
    <Link
      key={quiz.id}
      href="/quizzes/[id]/edit"
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

export default ShowCoursePage

ShowCoursePage.getInitialProps = async (ctx: any) => {
  // TODO: ideally this should fetch course details, not quiz details
  const id: string = ctx.query.id.toString()
  const quizzes = await fetchCourseQuizzes(id)
  return {
    quizzes,
    id,
  }
}
