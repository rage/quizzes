import React from "react"
import { Item } from "../../../types/NormalizedQuiz"
import styled from "styled-components"
import EssayContent from "./EssayContent"
import { Card, Typography, TextField, Select } from "@material-ui/core"
import MultipleChoiceContent from "./MultipleChoiceContent"
import CheckBoxContent from "./CheckBoxContent"
import OpenContent from "./OpenContent"
import ScaleContent from "./ScaleContent"
import { editedQuizItemTitle } from "../../../store/editor/items/itemAction"
import { useDispatch } from "react-redux"
import DebugDialog from "../../DebugDialog"

const QuizCard = styled(Card)`
  box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 40px -12px !important;
  border-radius: 1rem !important;
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 800px;
`
const IconWrapper = styled.div`
  font-size: 3.5rem;
  margin: 0 1.5rem 0 0.5rem;
  @media (max-width: 550px) {
    text-align: center;
  }
`

const QuizItemContainer = styled.div``

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const TypeContainer = styled.div`
  margin-right: 1.5rem;
  width: 5rem;
`

const QuizContent = styled.div`
  padding: 1rem;
`

const StyledTextField = styled(TextField)`
  background-color: white;
  border-radius: 1rem;
  overflow: auto;
  width: 100%;
  margin-top: 0.25rem !important;
`

const StyledSelectField = styled(Select)`
  background-color: white;
  border-radius: 1rem;
  overflow: auto;
  edititemeditedtitlewidth: 100%;
  margin-top: 0.25rem !important;
`

interface QuizItemProps {
  item: Item
}

const QuizItem = ({ item }: QuizItemProps) => {
  return (
    <div>
      <QuizItemContainer>
        <Typography variant="h4">{item.type}</Typography>
        {contentBasedOnType(item.type, item)}
      </QuizItemContainer>

      <br />
    </div>
  )
}

const contentBasedOnType = (type: string, item: Item) => {
  switch (type) {
    case "multiple-choice": {
      return <MultipleChoiceContent item={item} />
    }
    case "checkbox": {
      return <CheckBoxContent item={item} />
    }
    case "essay": {
      return <EssayContent item={item} />
    }
    case "open": {
      return <OpenContent item={item} />
    }
    case "scale": {
      return <ScaleContent item={item} />
    }
    default: {
      return <h1>Hi, I'm new/unknown</h1>
    }
  }
}

export default QuizItem
