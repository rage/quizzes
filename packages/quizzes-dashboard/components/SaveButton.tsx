import React, { Suspense, useState } from "react"
import {
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Fab,
} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { EditorState } from "../store/edit/reducers"
import { connect } from "react-redux"
import { EditableQuiz } from "../types/EditQuiz"
import { saveQuiz } from "../services/quizzes"
import { initializedEditor } from "../store/edit/actions"

const SaveButton = ({ quiz, updateEditorState }: any) => {
  const [saved, setSaved] = useState(true)
  const [showMessage, setShowMessage] = useState(false)

  const handleClick = async (quiz: EditableQuiz) => {
    setSaved(false)
    const response = await saveQuiz(quiz)
    setSaved(true)
    setShowMessage(true)
    console.log(response)
    updateEditorState(response)
  }

  const style = {
    margin: 0,
    top: "auto",
    right: 100,
    left: "auto",
    position: "fixed",
  }

  return (
    <>
      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setShowMessage(false)}
      >
        <Alert severity="success" onClose={() => setShowMessage(false)}>
          Quiz saved succesfully!
        </Alert>
      </Snackbar>

      {saved ? (
        <Fab
          color="primary"
          variant="extended"
          onClick={() => handleClick(quiz)}
          style={{
            padding: "1rem",
            position: "fixed",
            top: 100,
            right: 100,
            left: "auto",
            bottom: "auto",
          }}
        >
          <Typography variant="h6">Save Quiz</Typography>
        </Fab>
      ) : (
        <CircularProgress
          color="secondary"
          style={{
            padding: "1rem",
            position: "fixed",
            top: 100,
            right: 100,
            left: "auto",
            bottom: "auto",
          }}
        />
      )}
    </>
  )
}

const mapStateToProps = (state: EditorState) => {
  return {
    quiz: state,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateEditorState: (quiz: EditableQuiz) =>
      dispatch(initializedEditor(quiz)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveButton)
