import React from "react"
import BasicInformation from "./BasicInfo"
import { EditableQuiz } from "../../types/EditQuiz"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
}

const CheckBoxQuizEditForm = () => {
  return (
    <>
      <BasicInformation />
      <div>
        <h1>Checkbox type</h1>
      </div>
    </>
  )
}

export default CheckBoxQuizEditForm
