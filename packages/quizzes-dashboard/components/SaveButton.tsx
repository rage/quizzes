import React from "react"
import { Typography, Button } from "@material-ui/core"
import { EditorState } from "../store/edit/reducers"
import { connect } from "react-redux"
import { EditableQuiz } from "../types/EditQuiz"
import { saveQuiz } from "../services/quizzes"

const SaveButton = ({ quiz }: any) => {
  const handleClick = async (quiz: EditableQuiz) => {
    console.log(quiz)
    const response = await saveQuiz(quiz)
    console.log(response)
  }

  return (
    <Button
      color="primary"
      variant="outlined"
      onClick={() => handleClick(quiz)}
    >
      <Typography variant="h6">Save Quiz</Typography>
    </Button>
  )
}

const mapStateToProps = (state: EditorState) => {
  return {
    quiz: state,
  }
}

export default connect(mapStateToProps, null)(SaveButton)
