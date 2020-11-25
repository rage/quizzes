import React from "react"
import { Answer } from "../../types/Answer"
import AnswerCard from "../Answer"

export interface AnswerListProps {
  data: Answer[]
  expandAll: boolean
}

export const AnswerList = ({ data, expandAll }: AnswerListProps) => {
  return (
    <>
      {data?.map(answer => (
        <AnswerCard key={answer.id} answer={answer} expanded={expandAll} />
      ))}
    </>
  )
}
