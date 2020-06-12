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
  const [showSpinner, setShowSpinner] = useState(false)

  const handleClick = async (quiz: EditableQuiz) => {
    setSaved(false)
    setShowSpinner(true)
    const response = await saveQuiz(quiz)
    setShowSpinner(false)
    if (response.errorMessage === undefined) {
      setSaved(true)
      updateEditorState(response)
    }
    setShowMessage(true)
  }

  return (
    <>
      <Snackbar
        open={showMessage}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setShowMessage(false)}
      >
        {saved ? (
          <Alert severity="success" onClose={() => setShowMessage(false)}>
            Quiz saved succesfully!
          </Alert>
        ) : (
          <Alert severity="error" onClose={() => setShowMessage(false)}>
            Something went wrong, couldn't save quiz!
          </Alert>
        )}
      </Snackbar>

      {showSpinner ? (
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
      ) : (
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
