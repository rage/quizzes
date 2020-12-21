import React, { useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import usePromise from "react-use-promise"
import { fetchQuiz, getAnswerById } from "../../../../services/quizzes"
import AnswerCard from "../../../../components/Answer"

import {
  TabTextLoading,
  TabText,
  TabTextError,
} from "../../../../components/quizPages/TabHeaders"
import SkeletonLoader from "../../../../components/Shared/SkeletonLoader"

export const AnswerById = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString()
  // When doing a full reload answerId is briefly undefined
  const answerId = route.query.answerId?.toString()

  const [answerResponse, answerError] = usePromise(async () => {
    if (!answerId) {
      return
    }
    return await getAnswerById(answerId)
  }, [answerId])

  const [quiz, quizError] = usePromise(async () => {
    if (!quizId) {
      return
    }
    return await fetchQuiz(quizId)
  }, [quizId])

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quiz?.courseId}/listing`,
      href: "/courses/[courseId]/[...page]",
    },
    {
      label: `${quiz?.title}`,
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

  if (answerError || quizError) {
    return (
      <>
        <TabTextError />
        <div>Something went wrong...</div>
      </>
    )
  }

  if (!answerResponse || !quiz) {
    return (
      <>
        <TabTextLoading />
        <SkeletonLoader height={300} skeletonCount={1} />
      </>
    )
  }

  return (
    <>
      <TabText text="Singular answer" />
      <AnswerCard answer={answerResponse} />
    </>
  )
}

export default AnswerById
