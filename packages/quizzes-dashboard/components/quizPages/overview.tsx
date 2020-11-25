import React from "react"
import usePromise from "react-use-promise"
import {
  fetchQuiz,
  fetchCourseById,
  getUserAbilitiesForCourse,
} from "../../services/quizzes"
import { Skeleton } from "@material-ui/lab"
import styled from "styled-components"
import { Typography, Card } from "@material-ui/core"
import { useRouter } from "next/router"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import DownloadInfoForms from "../DownloadInfoForms"
import QuizTitle from "./QuizTitleContainer"
import { TabTextError, TabText, TabTextLoading } from "./TabHeaders"
import { AnswerStatistics } from "./AnswerStatistics"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const DescriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  white-space: pre-line;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
`

const StyledCard = styled(Card)`
  display: flex;
  justify-content: space-around !important;
  flex-wrap: wrap !important;
  width: 100%;
  margin-top: 1rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 7px 0px,
    rgba(0, 0, 0, 0.15) 0px 3px 6px -2px, rgba(0, 0, 0, 0.25) 0px 1px 10px 0px !important;
`

export const OverView = () => {
  const router = useRouter()
  const quizId = router.query.quizId?.toString() ?? ""

  const [quiz, quizError] = usePromise(() => fetchQuiz(quizId), [])
  const [course, courseError] = usePromise(
    () => fetchCourseById(quiz?.courseId ?? ""),
    [quiz],
  )
  const [userAbilities, userError] = usePromise(
    () => getUserAbilitiesForCourse(quiz?.courseId ?? ""),
    [quiz],
  )

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: `${course ? course.title : ""}`,
      as: `/courses/${quiz?.courseId}/listing`,
      href: "/courses/[courseId]/[...page]",
    },
    {
      label: `${quiz ? quiz.title : ""}`,
    },
  ])

  if (!quiz || !course || !userAbilities) {
    return (
      <>
        <TabTextLoading />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
      </>
    )
  }

  if (quizError || courseError || userError) {
    return <TabTextError />
  }

  return (
    <>
      <TabText text={quiz.title} />
      <QuizTitle quiz={quiz} course={course} />
      <StyledCard>
        {quiz.body && (
          <DescriptionContainer>
            <Typography>{quiz.body}</Typography>
          </DescriptionContainer>
        )}
      </StyledCard>
      <StyledCard>
        <Typography variant="h3">Quiz answer by status</Typography>
        <AnswerStatistics />
      </StyledCard>
      {userAbilities.includes("download") ? (
        <DownloadInfoForms quiz={quiz} course={course} />
      ) : (
        ""
      )}
    </>
  )
}

export default OverView
