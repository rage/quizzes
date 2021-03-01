import React, { useEffect } from "react"
import { NormalizedItem } from "../../../types/NormalizedQuiz"
import styled from "styled-components"
import EssayContent from "./EssayContent"
import { Typography, Button } from "@material-ui/core"
import MultipleChoiceContent from "./MultipleChoiceContent"
import CheckBoxContent from "./CheckBoxContent"
import OpenContent from "./OpenContent"
import ScaleContent from "./ScaleContent"
import CustomFrontend from "./CustomFrontend"
import MultipleChoiceDropdownContent from "./MultipleChoiceDropdownContent"
import ClickableMultipleChoiceContent from "./ClickableMultipleChoiceContent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import {
  decreasedItemOrder,
  increasedItemOrder,
} from "../../../store/editor/items/itemAction"
import { checkForChanges } from "../../../store/editor/editorActions"
import { useTypedSelector } from "../../../store/store"

const TypeWrapper = styled.div`
  display: flex;
`
const StyledText = styled(Typography)`
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
`

const QuizItemContainer = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

interface QuizItemProps {
  item: NormalizedItem
}

const QuizItem = ({ item }: QuizItemProps) => {
  const store = useTypedSelector(state => state)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(checkForChanges(store))
  }, [store])

  return (
    <>
      <TypeWrapper>
        <StyledText variant="h4">{item.type}</StyledText>
        <Button onClick={() => dispatch(decreasedItemOrder(item.id))}>
          <FontAwesomeIcon icon={faAngleUp} size="2x" />
        </Button>
        <Button onClick={() => dispatch(increasedItemOrder(item.id))}>
          <FontAwesomeIcon icon={faAngleDown} size="2x" />
        </Button>
      </TypeWrapper>
      <QuizItemContainer>
        {contentBasedOnType(item.type, item)}
      </QuizItemContainer>
    </>
  )
}

const contentBasedOnType = (type: string, item: NormalizedItem) => {
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
    case "multiple-choice-dropdown": {
      return <MultipleChoiceDropdownContent item={item} />
    }
    case "clickable-multiple-choice": {
      return <ClickableMultipleChoiceContent item={item} />
    }
    default: {
      return <h1>Hi, I'm new/unknown</h1>
    }
  }
}

export default QuizItem
