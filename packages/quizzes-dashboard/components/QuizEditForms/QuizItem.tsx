import React from "react"
import { Item } from "../../types/EditQuiz"
import styled from "styled-components"
import EssayContent from "./EssayContent"
import {
  Card,
  Typography,
  TextField,
  MenuItem,
  Select,
} from "@material-ui/core"
import MultipleChoiceContent from "./MultipleChoiceContent"
import CheckBoxContent from "./CheckBoxContent"
import OpenContent from "./OpenContent"
import ScaleContent from "./ScaleContent"
import { EditorState } from "../../store/edit/reducers"
import { editedQuizTitle } from "../../store/edit/actions"
import { connect } from "react-redux"

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

const QuizHeader = styled.div`
  background-color: rgb(33, 48, 148);
  color: white;
  padding: 1rem;
  display: flex;
`

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const TitleContainer = styled.div`
  flex: 1;
  margin-right: 1rem;
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
  width: 100%;
  margin-top: 0.25rem !important;
`
interface QuizItemProps {
  item: Item
  items: Item[]
  editItemTitle: (newTitle: string, itemId: string) => any
}

const QuizItem = ({ item, items, editItemTitle }: QuizItemProps) => {
  console.log(items)
  console.log(item.type)
  return (
    <div>
      <QuizCard>
        <QuizHeader>
          <TitleContainer>
            <div>Quiz item name:</div>
            <StyledTextField
              id={item.id}
              variant="outlined"
              defaultValue={item.texts[0].title}
              onChange={event => editItemTitle(event.target.value, item.id)}
            />
          </TitleContainer>
          <TypeContainer>
            <div>Quiz type:</div>
            <StyledSelectField defaultValue={item.type.toString()}>
              <MenuItem value="multiple-choice">multiple-choice</MenuItem>
              <MenuItem value="checkbox">checkbox</MenuItem>
              <MenuItem value="essay">essay</MenuItem>
              <MenuItem value="open">open</MenuItem>
              <MenuItem value="scale">scale</MenuItem>
            </StyledSelectField>
          </TypeContainer>
        </QuizHeader>

        <QuizContent>
          {contentBasedOnType(item.type.toString(), item.id)}
        </QuizContent>
      </QuizCard>
      <br />
    </div>
  )
}

const contentBasedOnType = (type: string, id: string) => {
  switch (type) {
    case "multiple-choice": {
      return <MultipleChoiceContent itemId={id} />
    }
    case "checkbox": {
      return <CheckBoxContent itemId={id} />
    }
    case "essay": {
      return <EssayContent itemId={id} />
    }
    case "open": {
      return <OpenContent itemId={id} />
    }
    case "scale": {
      return <ScaleContent itemId={id} />
    }
    default: {
      return <h1>Hi, I'm new/unknown</h1>
    }
  }
}

const mapStateToProps = (state: EditorState) => {
  return {
    items: state.items,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    editItemTitle: (newTitle: string, itemId: string) =>
      dispatch(editedQuizTitle(newTitle, itemId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizItem)
