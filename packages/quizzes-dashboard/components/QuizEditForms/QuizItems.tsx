import React from "react"
import { useTypedSelector } from "../../store/store"
import QuizItem from "./QuizItem"

const QuizItems = () => {
  const storeItems = Object.values(
    useTypedSelector(state => state.editor.items),
  )
  return (
    <>
      {storeItems.map(item => {
        return <QuizItem key={item.id} item={item} />
      })}
    </>
  )
}

export default QuizItems
