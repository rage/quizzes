import React from "react"
import Editor from "@monaco-editor/react"

interface EditableDebugFieldProps {
  initialValue: string
}

export default ({ initialValue }: EditableDebugFieldProps) => {
  return (
    <Editor
      options={{ wordWrap: "on" }}
      height="80vh"
      language="json"
      value={initialValue}
    />
  )
}
