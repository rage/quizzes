import React from "react"
import { Answer } from "../types/Answer"
import styled from "styled-components"
import { Skeleton } from "@material-ui/lab"
import AnswerCard from "./Answer"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

export interface AnswerListProps {
  data: Answer[] | undefined
  error: any
  expandAll: boolean
}

export const AnswerList = ({ data, error, expandAll }: AnswerListProps) => {
  if (error) {
    return <div>Error while fetching answers.</div>
  }
  if (!data) {
    return (
      <>
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
  return (
    <>
      {data.map(answer => (
        <AnswerCard key={answer.id} answer={answer} expanded={expandAll} />
      ))}
    </>
  )
}
