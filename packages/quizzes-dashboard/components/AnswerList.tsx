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
}

export const AnswerList = ({ data, error }: AnswerListProps) => {
  console.log(data)
  console.log(error)
  if (error) {
    return <div>Error while fetching courses.</div>
  }
  if (!data) {
    return (
      <>
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
      </>
    )
  }
  return (
    <>
      {data.map(answer => (
        <AnswerCard key={answer.id} answer={answer} />
      ))}
    </>
  )
}
