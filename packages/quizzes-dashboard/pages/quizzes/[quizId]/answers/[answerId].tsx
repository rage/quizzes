import React, { useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import usePromise from "react-use-promise"
import { fetchQuiz, getAnswerById } from "../../../../services/quizzes"
import AnswerCard from "../../../../components/Answer"
import styled from "styled-components"
import { Skeleton } from "@material-ui/lab"
import Head from "next/head"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

export const AnswerById = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""
  const answerId = route.query.answerId?.toString() ?? ""
  const [expanded, setExpanded] = useState(true)
  const [answerResponse, answerError] = usePromise(
    () => getAnswerById(answerId),
    [],
  )
  const [quizResponse, quizError] = usePromise(() => fetchQuiz(quizId), [])

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quizResponse?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: "Quiz page",
      as: `/quizzes/${quizId}/overview`,
      href: "/quizzes/[quizId]/overview",
    },
    {
      label: "All Answers",
      as: `/quizzes/${quizId}/all-answers`,
      href: "/quizzes/[quizId]/all-answers",
    },
    {
      label: "Answer",
    },
  ])

  if (!answerResponse) {
    return (
      <>
        <div>
          <Head>
            <title>loading... | Quizzes</title>
            <meta
              name="quizzes"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
        </div>
        <StyledSkeleton variant="rect" height={300} animation="wave" />
      </>
    )
  }

  return (
    <>
      <div>
        <Head>
          <title>Singular answer | Quizzes</title>
          <meta
            name="quizzes"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>
      <AnswerCard answer={answerResponse} expanded={expanded} />
    </>
  )
}

export default AnswerById
