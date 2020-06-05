import React from "react"
import BasicInformation from "./BasicInfo"
import { EditableQuiz, Item } from "../../types/EditQuiz"

interface contentBoxProps {
  item: Item
}

const CheckBoxContent = ({ item }: contentBoxProps) => {
  return (
    <>
      <div>
        <h1>Checkbox type</h1>
      </div>
    </>
  )
}

export default CheckBoxContent
