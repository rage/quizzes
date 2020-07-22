import React from "react"
import { ItemAnswer } from "../../../../types/Answer"
import SingleItemAnswer from "./SingleItemAnswer"

export interface ItemAnswerProps {
  itemAnswers: ItemAnswer[]
}

export const ItemAnswers = ({ itemAnswers }: ItemAnswerProps) => {
  return (
    <>
      {itemAnswers.map(itemAnswer => (
        <SingleItemAnswer itemAnswer={itemAnswer} key={itemAnswer.id} />
      ))}
    </>
  )
}

export default ItemAnswers
