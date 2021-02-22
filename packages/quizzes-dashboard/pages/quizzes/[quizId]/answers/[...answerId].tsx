import React, { useEffect, useState } from "react"
import styled from "styled-components"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { Tab, Tabs, Typography } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChalkboard, faScroll } from "@fortawesome/free-solid-svg-icons"
import AnswerCard from "../../../../components/Answer"
import {
  TabTextLoading,
  TabText,
  TabTextError,
} from "../../../../components/quizPages/TabHeaders"
import SkeletonLoader from "../../../../components/Shared/SkeletonLoader"
import { useQuiz } from "../../../../hooks/useQuiz"
import { useAnswer } from "../../../../hooks/useAnswer"
import { useStatusChangeLogs } from "../../../../hooks/useStatusChangeLogs"
import { Answer } from "../../../../types/Answer"

interface IAnswerStatusChange {
  createdAt: Date
  id: string
  modifierId: number
  operation: string
  quizAnswer: Omit<Answer, "userQuizState" | "itemAnswers" | "peerReviews">
  quizAnswerId: string
  updatedAt: Date
}

const StyledTable = styled.table`
  width: 100%;
  text-align: left;
  margin: 5rem 0;
  overflow-x: auto;
  border-collapse: collapse;

  td {
    padding: 0.5rem;
  }
`

interface ITableRowProps {
  operation: string | undefined
}

const StyledTableRow = styled.tr<ITableRowProps>`
  :not(:first-child) {
    background-color: ${({ operation }) =>
      operation === "teacher-accept" || operation === "peer-review-reject"
        ? "#bbffb9"
        : "#ff7f8a"};
  }
`

const StyledTypography = styled(Typography)`
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 10rem !important;
`

const Loader = () => (
  <>
    <TabTextLoading />
    <SkeletonLoader height={300} skeletonCount={1} />
  </>
)

function sortFunction(a: any, b: any) {
  var dateA = new Date(a.date).getTime()
  var dateB = new Date(b.date).getTime()
  return dateA > dateB ? 1 : -1
}

const Log = ({ answerId }: { answerId: string | undefined }) => {
  const LOG_LIST_SIZE = 10

  const {
    answerStatusChanges,
    answerStatusChangesLoading,
    answerStatusChangesError,
  } = useStatusChangeLogs(answerId, `${answerId}-logs`)

  if (answerStatusChangesLoading) return <Loader />
  if (answerStatusChangesError)
    return (
      <StyledTypography variant="h2">
        Something went wrong fetching status changes...
      </StyledTypography>
    )

  if (answerStatusChanges.length === 0)
    return (
      <StyledTypography variant="h2">
        No quiz answer status changes have been logged for this answer.
      </StyledTypography>
    )

  return (
    <StyledTable>
      <tr>
        <th>Operation</th>
        <th>Modifier ID</th>
        <th>Occurred at</th>
      </tr>

      {answerStatusChanges &&
        answerStatusChanges
          .sort(sortFunction)
          .slice(0, LOG_LIST_SIZE)
          .map((log: IAnswerStatusChange) => {
            const { operation, modifierId, createdAt } = log
            const formattedOperationDate = createdAt
              .toLocaleString()
              .substring(0, 16)
              .replace("T", " ")

            return (
              <StyledTableRow operation={operation}>
                <td>{operation}</td>
                <td>{modifierId}</td>
                <td>{formattedOperationDate}</td>
              </StyledTableRow>
            )
          })}
    </StyledTable>
  )
}

export const AnswerById = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString()

  // When doing a full reload answerId is briefly undefined
  const answerId = route.query.answerId && route.query.answerId[0].toString()
  const pathname = `/quizzes/${quizId}/answers/${answerId}`

  const [currentTab, setCurrentTab] = useState("overview")

  // conditional fetches
  const { answer, answerLoading, answerError } = useAnswer(answerId, "answer")
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
        <Log answerId={answerId} />
      )}
    </>
  )
}

export default AnswerById
