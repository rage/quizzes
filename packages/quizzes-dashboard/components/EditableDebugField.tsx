import React from "react"
import { ControlledEditor } from "@monaco-editor/react"

interface EditableDebugFieldProps {
  initialValue: string
  setDebugViewChanges: React.Dispatch<React.SetStateAction<string | null>>
}

const EditableDebugField = ({
  initialValue,
  setDebugViewChanges,
}: EditableDebugFieldProps) => {
  const handleEditorChange = (_unusedParam: any, value: string | undefined) => {
    const editedQuiz = JSON.parse(value as string)
    // send changes to parent
    setDebugViewChanges(editedQuiz)
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
