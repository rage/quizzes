import React, { useState, useEffect } from "react"
import {
  Typography,
  CircularProgress,
  Snackbar,
  Fab,
  Zoom,
} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useDispatch } from "react-redux"
import { saveQuiz } from "../services/quizzes"
import {
  initializedEditor,
  checkForChanges,
} from "../store/editor/editorActions"
import { useTypedSelector, storeState } from "../store/store"
import { denormalize, normalize } from "normalizr"
import { normalizedQuiz } from "../schemas"
import { Quiz } from "../types/Quiz"
import styled from "styled-components"

const StyledFab = styled(Fab)`
  display: flex !important;
  position: fixed !important;
  top: 10% !important;
  right: 5% !important;
  z-index: 1 !important;
  @media only screen and (max-width: 600px) {
    top: 90% !important;
    right: 5% !important;
  }
`

const StyledCircularProgress = styled(CircularProgress)`
  display: flex !important;
  position: fixed !important;
  top: 10% !important;
  right: 5% !important;
  z-index: 1 !important;
  @media only screen and (max-width: 600px) {
    top: 90% !important;
    right: 5% !important;
  }
`

const SaveButton = () => {
  const dispatch = useDispatch()

  const [saved, setSaved] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  const store = useTypedSelector(state => state)
  const quizId = useTypedSelector(state => state.editor.quizId)
  const changes = useTypedSelector(state => state.editor.editorChanges.changes)

  const handleClick = async (store: storeState) => {
    setSaved(false)
    setShowSpinner(true)

    let quizData = {
      quizzes: store.editor.quizzes,
      items: store.editor.items,
      options: store.editor.options,
      quizId: store.editor.quizId,
      peerReviews: store.editor.peerReviews,
      questions: store.editor.questions,
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
    for (let peerReview of quiz.peerReviews) {
      if (
        store.editor.peerReviewVariables[peerReview.id].newQuestions.length > 0
      ) {
        for (let question of peerReview.questions) {
          if (
            store.editor.peerReviewVariables[peerReview.id].newQuestions.some(
              id => id === question.id,
            )
          ) {
            delete question.id
            if (
              store.editor.quizVariables[
                store.editor.quizId
              ].newPeerReviews.some(id => id === peerReview.id)
            ) {
              delete question.peerReviewCollectionId
            }
          }
        }
      }
      if (
        store.editor.quizVariables[store.editor.quizId].newPeerReviews.some(
          id => id === peerReview.id,
        )
      ) {
        delete peerReview.id
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
        peerReviews: normalizedResponse.entities.peerReviews ?? {},
        questions: normalizedResponse.entities.questions ?? {},
      }
      dispatch(initializedEditor(data, response))
      setSaved(true)
    }
    setShowMessage(true)
  }

  useEffect(() => {
    dispatch(checkForChanges(store))
  }, [store])

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
          <StyledCircularProgress color="secondary" />
        ) : (
          <>
            <Zoom in={changes}>
              <StyledFab
                color="primary"
                variant="extended"
                onClick={() => handleClick(store)}
              >
                {store.editor.quizVariables[store.editor.quizId].newQuiz ? (
                  <Typography variant="h6">Create Quiz</Typography>
                ) : (
                  <Typography variant="h6">Save Quiz</Typography>
                )}
              </StyledFab>
            </Zoom>
          </>
        )}
      </>
    )
  } else {
    return <></>
  }
}

export default SaveButton
