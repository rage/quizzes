import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Switch, Typography } from "@material-ui/core"
import React, { useState } from "react"
import styled from "styled-components"
import {
  setBulkSelectedIds,
  toggleBulkSelectMode,
  useAnswerListState,
} from "../../contexts/AnswerListContext"
import { Answer } from "../../types/Answer"
import AnswerSearchForm from "../AnswerSearchForm"
import { SwitchField } from "../quizPages/answers/styles"
import { editableAnswerStates } from "./constants"

const BulkSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  div:nth-of-type(1) {
    margin-right: 3rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    > button {
      margin: 1rem 0;
    }
  }
`

const OptionsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`

const AnswerListOptions = ({
  answers,
  handleTextSearch,
}: {
  answers: { results: Answer[]; total: number }
  handleTextSearch: (searchQuery: string) => Promise<void>
}) => {
  const [{ bulkSelectMode }, dispatch] = useAnswerListState()
  const [enableSearch, setEnableSearch] = useState(false)

  const handleSelectAll = () => {
    const allSelected = answers?.results
      .filter(answer => editableAnswerStates.includes(answer.status))
      .map(editableAnswer => editableAnswer.id)
    dispatch(setBulkSelectedIds(allSelected))
  }

  const handleBulkSelectToggle = () => {
    dispatch(setBulkSelectedIds([]))
    dispatch(toggleBulkSelectMode())
  }

  return (
    <OptionsWrapper>
      <BulkSelectWrapper>
        <SwitchField>
          <Typography>Bulk select answers</Typography>
          <Switch checked={bulkSelectMode} onChange={handleBulkSelectToggle} />
        </SwitchField>
        {bulkSelectMode && (
          <>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ minWidth: "7rem" }}
              onClick={handleSelectAll}
            >
              Select all
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "2rem" }}
              onClick={() => {
                dispatch(setBulkSelectedIds([]))
              }}
            >
              Clear Selection
            </Button>
          </>
        )}
      </BulkSelectWrapper>
      <div
        onClick={() => setEnableSearch(!enableSearch)}
        style={{ cursor: "pointer" }}
      >
        <FontAwesomeIcon icon={faSearch} size="2x" />
        <Typography>{enableSearch ? "Hide" : "Search"}</Typography>
      </div>
      {enableSearch && <AnswerSearchForm handleSubmit={handleTextSearch} />}
    </OptionsWrapper>
  )
}

export default AnswerListOptions
