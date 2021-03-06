import React, { useEffect, useState } from "react"
import {
  TextField,
  Tab,
  Tabs,
  Paper,
  Typography,
  Link,
} from "@material-ui/core"
import styled from "styled-components"
import { MarkDownText } from "./MarkDownText"

const StyledAppBar = styled(Paper)`
  margin-bottom: 1rem;
  .MuiTabs-indicator {
    background-color: #8398f9;
    height: 0.25rem;
  }
`

const HelperText = styled(Typography)`
  font-size: 80% !important;
  dispaly: flex !important;
  color: #9e9e9e !important;
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
  margin-left: 1rem !important;
  margin-right: 1rem !important;
`

const EditorWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`

export interface ExerciseEditorProps {
  onChange: (e: any) => any
  text: string
  label: string
}

export const MarkdownEditor = ({
  text,
  label,
  onChange,
}: ExerciseEditorProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [showTabs, setShowTabs] = useState(text.length > 0)

  useEffect(() => {
    setShowTabs(text.length > 0)
  }, [text])
  return (
    <>
      <EditorWrapper>
        <StyledAppBar>
          <Tabs
            indicatorColor="primary"
            value={activeTab}
            onChange={(_, value) => {
              setActiveTab(value)
            }}
          >
            <Tab label="Source" />
            <Tab label="Preview" />
          </Tabs>
        </StyledAppBar>
        <HelperText>
          This is markdown editor. You can write your text as markdown and
          preview it by selecting "PREVIEW". For more info about markdown visit
          <Link href="https://spec.commonmark.org/current/">
            {" "}
            https://spec.commonmark.org/current/
          </Link>
        </HelperText>
        {activeTab === 0 && (
          <TextField
            label={label}
            fullWidth
            variant="outlined"
            type="text"
            value={text}
            onChange={onChange}
            rowsMax={1000}
            multiline
            required
          />
        )}
        {activeTab === 1 && <MarkDownText text={text} />}
      </EditorWrapper>
    </>
  )
}

export default MarkdownEditor
