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
import CustomFrontend from "./CustomFrontend"

const QuizItemContainer = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

const StyledText = styled(Typography)`
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
`

interface QuizItemProps {
  item: Item
}

const QuizItem = ({ item }: QuizItemProps) => {
  return (
    <QuizItemContainer>
      <StyledText variant="h4">{item.type}</StyledText>
      {contentBasedOnType(item.type, item)}
    </QuizItemContainer>
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
    case "custom-frontend-accept-data": {
      return <CustomFrontend item={item} />
    }
    default: {
      return <h1>Hi, I'm new/unknown</h1>
    }
  }
}

export default QuizItem
