import React, { useEffect, useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import usePromise from "react-use-promise"
import { Tab, Tabs, Typography } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChalkboard, faScroll } from "@fortawesome/free-solid-svg-icons"
import { fetchQuiz, getAnswerById } from "../../../../services/quizzes"
import AnswerCard from "../../../../components/Answer"
import {
  TabTextLoading,
  TabText,
  TabTextError,
} from "../../../../components/quizPages/TabHeaders"
import SkeletonLoader from "../../../../components/Shared/SkeletonLoader"
import { useQuiz } from "../../../../hooks/useQuiz"
import { useAnswer } from "../../../../hooks/useAnswer"

const Log = () => {
  return <div>hhhh</div>
}

export const AnswerById = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString()

  // When doing a full reload answerId is briefly undefined
  const answerId = route.query.answerId && route.query.answerId[0].toString()
  const pathname = `/quizzes/${quizId}/answers/${answerId}`

  const [currentTab, setCurrentTab] = useState("overview")

  // conditional fetches
  const { answer, answerLoading, answerError } = useAnswer(answerId, "quiz")
  const { quiz, quizLoading, quizError } = useQuiz(quizId, "quiz")

  /* for when tab is loaded through url*/
  useEffect(() => {
    if (route.query.answerId) {
      setCurrentTab(route.query.answerId[1])
    }
  }, [route])

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

  if (answerLoading || quizLoading) {
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
      <Tabs
        variant="fullWidth"
        value={currentTab}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab
          key="overview"
          icon={<FontAwesomeIcon icon={faChalkboard} />}
          value="overview"
          label={<Typography>Overview</Typography>}
          onClick={() => {
            route.push(`${pathname}/overview`, undefined, { shallow: true })
          }}
        />
        <Tab
          key="status-change-log"
          icon={<FontAwesomeIcon icon={faScroll} />}
          value="status-change-log"
          label={<Typography>Status Change Log</Typography>}
          onClick={() => {
            route.push(`${pathname}/status-change-log`, undefined, {
              shallow: true,
            })
          }}
        />
      </Tabs>
      {currentTab === "overview" && answer ? (
        <AnswerCard answer={answer} />
      ) : (
        <Log />
      )}
    </>
  )
}

export default AnswerById
