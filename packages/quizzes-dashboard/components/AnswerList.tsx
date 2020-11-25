import React from "react"
import { Answer } from "../types/Answer"
import AnswerCard from "./Answer"

export interface AnswerListProps {
  data: Answer[]
  error: any
  expandAll: boolean
}

export const AnswerList = ({ data, error, expandAll }: AnswerListProps) => {
  return (
    <>
      {data?.map(answer => (
        <AnswerCard key={answer.id} answer={answer} expanded={expandAll} />
      ))}
    </>
  )
}
