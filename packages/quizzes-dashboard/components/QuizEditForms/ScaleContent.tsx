import React from "react"
import { Item } from "../../types/EditQuiz"

interface contentBoxProps {
  item: Item
}

const ScaleContent = ({ item }: contentBoxProps) => {
  return <h1>Scale content</h1>
}

export default ScaleContent
