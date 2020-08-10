import React, { useState } from "react"
import { Typography, CircularProgress, Snackbar, Fab } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useDispatch } from "react-redux"
import { saveQuiz } from "../services/quizzes"
import { initializedEditor } from "../store/editor/editorActions"
import { useTypedSelector, storeState } from "../store/store"
import { denormalize, normalize } from "normalizr"
import { normalizedQuiz, options } from "../schemas"
import { Quiz } from "../types/Quiz"
import Router, { useRouter } from "next/router"

const SaveButton = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [saved, setSaved] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  const store = useTypedSelector(state => state)
  const quizId = useTypedSelector(state => state.editor.quizId)

  const handleClick = async (store: storeState) => {
    setSaved(false)
    setShowSpinner(true)

    let quizData = {
      quizzes: store.editor.quizzes,
      items: store.editor.items,
      options: store.editor.options,
      quizId: store.editor.quizId,
    }

    const quiz: Quiz = denormalize(quizData.quizId, normalizedQuiz, quizData)
    for (let item of quiz.items) {
      if (store.editor.itemVariables[item.id].newOptions.length > 0) {
        for (let option of item.options) {
          if (
            store.editor.itemVariables[item.id].newOptions.some(
              id => id === option.id,
            )
          ) {
            delete option.id
            if (
              store.editor.quizVariables[store.editor.quizId].newItems.some(
                id => id === item.id,
              )
            ) {
              delete option.quizItemId
            }
          }
        }
      }
      if (
        store.editor.quizVariables[store.editor.quizId].newItems.some(
          id => id === item.id,
        )
      ) {
        delete item.id
      }
    }
    if (store.editor.quizVariables[store.editor.quizId].newQuiz) {
      delete quiz.id
    }
    const response = await saveQuiz(quiz)

    setShowSpinner(false)
    if (response.errorMessage === undefined) {
      const normalizedResponse = normalize(response, normalizedQuiz)
      const data = {
        quizzes: normalizedResponse.entities.quizzes ?? {},
        items: normalizedResponse.entities.items ?? {},
        options: normalizedResponse.entities.options ?? {},
        result: normalizedResponse.result ?? "",
      }
      dispatch(initializedEditor(data, response))
      setSaved(true)
      router.push(
        {
          pathname: "/quizzes/[id]/edit",
          query: {
            quizId: data.result,
          },
        },
        `/quizzes/${data.result}/edit`,
      )
    }
    setShowMessage(true)
  }

  if (quizId) {
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
            onClick={() => handleClick(store)}
            style={{
              padding: "1rem",
              position: "fixed",
              top: 100,
              right: 100,
              left: "auto",
              bottom: "auto",
            }}
          >
            {store.editor.quizVariables[store.editor.quizId].newQuiz ? (
              <Typography variant="h6">Create Quiz</Typography>
            ) : (
              <Typography variant="h6">Save Quiz</Typography>
            )}
          </Fab>
        )}
      </>
    )
  } else {
    return <div>Waiting...</div>
  }
}

export default SaveButton
