import React, { Suspense, useState } from "react"
import { Typography, CircularProgress, Snackbar, Fab } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useDispatch } from "react-redux"
import { EditableQuiz } from "../types/EditQuiz"
import { saveQuiz } from "../services/quizzes"
import { initializedEditor } from "../store/edit/editActions"
import { useTypedSelector } from "../store/store"

const SaveButton = () => {
  const dispatch = useDispatch()
  const store = useTypedSelector(state => state.editor)

  const [saved, setSaved] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  const handleClick = async (store: EditableQuiz) => {
    setSaved(false)
    setShowSpinner(true)
    const response = await saveQuiz(store)
    setShowSpinner(false)
    if (response.errorMessage === undefined) {
      setSaved(true)
      dispatch(initializedEditor(response))
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
          // onClick={() => handleClick(store)}
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

export default SaveButton
