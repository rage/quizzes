import React from "react"
import { Item } from "../../types/EditQuiz"

interface contentBoxProps {
  item: Item
}

const OpenContent = ({ item }: contentBoxProps) => {
  return <h1>Open content</h1>
}

export default OpenContent
