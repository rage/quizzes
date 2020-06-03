import React from "react"
import BasicInformation from "./BasicInfo"
import { EditableQuiz } from "../../types/EditQuiz"

interface contentBoxProps {
  itemId: string
}

const CheckBoxContent = ({ itemId }: contentBoxProps) => {
  return (
    <>
      <div>
        <h1>Checkbox type</h1>
      </div>
    </>
  )
}

export default CheckBoxContent
