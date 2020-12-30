import React from "react"
import styled from "styled-components"
import { Typography, Card } from "@material-ui/core"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import DownloadInfoForms from "../DownloadInfoForms"
import QuizTitle from "./QuizTitleContainer"
import { TabText } from "./TabHeaders"
import { AnswerStatistics } from "./AnswerStatistics"
import { IQuizTabProps } from "./answers/types"

const DescriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  white-space: pre-line;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
`

const StyledCard = styled(Card)`
  @media (min-width: 768px) {
    padding: 3rem;
  }
  margin: 2rem 0;
  display: flex;
  justify-content: space-around !important;
  flex-wrap: wrap !important;
  width: 100%;
  margin-top: 1rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 7px 0px,
    rgba(0, 0, 0, 0.15) 0px 3px 6px -2px, rgba(0, 0, 0, 0.25) 0px 1px 10px 0px !important;
`

export const OverView = ({ quiz, course, userAbilities }: IQuizTabProps) => {
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

  return (
    <>
      <TabText text={quiz.title} />
      <QuizTitle quiz={quiz} />
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
      {userAbilities?.includes("download") && (
        <DownloadInfoForms quiz={quiz} course={course} />
      )}
    </>
  )
}

export default OverView
