import React from "react"
import { ItemAnswer } from "../../../../types/Answer"
import SingleItemAnswer from "./SingleItemAnswer"
import styled from "styled-components"

export const ItemAnswerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export interface ItemAnswerProps {
  itemAnswers: ItemAnswer[]
}

export const ItemAnswers = ({ itemAnswers }: ItemAnswerProps) => {
  return (
    <>
      <ItemAnswerWrapper>
        {itemAnswers.map(itemAnswer => (
          <SingleItemAnswer itemAnswer={itemAnswer} key={itemAnswer.id} />
        ))}
      </ItemAnswerWrapper>
    </>
  )
}

export default ItemAnswers
