import React from "react"
import styled from "styled-components"
import { Typography, Card, TextField } from "@material-ui/core"
import { editedQuizItemBody } from "../../store/edit/actions"
import { useDispatch } from "react-redux"
import { Item } from "../../types/EditQuiz"

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

const PointsContainer = styled.div`
  margin-right: 1.5rem;
  width: 5rem;
`

const QuizContent = styled.div`
  padding: 1rem;
`

const StyledTextField = styled(TextField)`
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  width: 100%;
  margin-top: 0.25rem !important;
`
interface essayContentProps {
  item: Item
}

const EssayContent = ({ item }: essayContentProps) => {
  const dispatch = useDispatch()
  return (
    <>
      <QuizContent>
        <TextField
          id="quiz-body"
          label="Quiz body"
          variant="outlined"
          multiline
          fullWidth
          rows="2"
          rowsMax="5000"
          defaultValue={item.texts[0].body}
          onChange={event =>
            dispatch(editedQuizItemBody(event.target.value, item.id))
          }
        />
        <br />
        <br />
      </QuizContent>
    </>
  )
}

export default EssayContent
