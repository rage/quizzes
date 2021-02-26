import React from "react"
import { ControlledEditor } from "@monaco-editor/react"
import { normalize } from "normalizr"
import { normalizedQuiz } from "../schemas"
import { initializedEditor } from "../store/editor/editorActions"

import { useDispatch } from "react-redux"
import { useTypedSelector } from "../store/store"
import { useQuiz } from "../hooks/useQuiz"

interface EditableDebugFieldProps {
  initialValue: string
}

const EditableDebugField = ({ initialValue }: EditableDebugFieldProps) => {
  const dispatch = useDispatch()
  const quizId = useTypedSelector(state => state.editor.quizId)
  const { quiz } = useQuiz(quizId, `quiz-${quizId}`)

  const handleEditorChange = (_unusedParam: any, value: string | undefined) => {
    const changedData = JSON.parse(value as string)

    // normalize quiz
    const normalizedUpdatedQuizData = normalize(changedData, normalizedQuiz)

    // cherry pick data pieces to put in state
    const normalizedDataToBeSentToEditorState = {
      quizzes: normalizedUpdatedQuizData.entities.quizzes ?? {},
      items: normalizedUpdatedQuizData.entities.items ?? {},
      options: normalizedUpdatedQuizData.entities.options ?? {},
      result: normalizedUpdatedQuizData.result,
      peerReviewCollections:
        normalizedUpdatedQuizData.entities.peerReviewCollections ?? {},
      questions: normalizedUpdatedQuizData.entities.questions ?? {},
    }

    // send to state
    dispatch(initializedEditor(normalizedDataToBeSentToEditorState, quiz!))
  }

  return (
    <ControlledEditor
      options={{ wordWrap: "on" }}
      height="80vh"
      language="json"
      value={initialValue}
      onChange={handleEditorChange}
    />
  )
}

export default EditableDebugField
