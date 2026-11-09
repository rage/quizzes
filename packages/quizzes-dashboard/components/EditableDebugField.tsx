import React from "react"

import Editor from "@monaco-editor/react"

interface EditableDebugFieldProps {
  initialValue: string
  setDebugViewChanges: React.Dispatch<React.SetStateAction<string | null>>
}

const EditableDebugField = ({
  initialValue,
  setDebugViewChanges,
}: EditableDebugFieldProps) => {
  const handleEditorChange = (value: string | undefined) => {
    setDebugViewChanges(value ?? null)
  }

  return (
    <Editor
      options={{ wordWrap: "on" }}
      height="80vh"
      language="json"
      defaultValue={initialValue}
      onChange={handleEditorChange}
    />
  )
}

export default EditableDebugField
