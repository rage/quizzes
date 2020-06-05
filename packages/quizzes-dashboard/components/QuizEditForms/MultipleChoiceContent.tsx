import React from "react"
import { Item } from "../../types/EditQuiz"

interface contentBoxProps {
  item: Item
}

const MultipleChoiceContent = ({ item }: contentBoxProps) => {
  return <h1>Multiple choice content</h1>
}

export default MultipleChoiceContent
