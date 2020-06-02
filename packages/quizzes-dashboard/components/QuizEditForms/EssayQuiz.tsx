import React from "react"
import styled from "styled-components"
import { Typography, Card, TextField, Button } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DebugDialog from "./../DebugDialog"
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import { EditableQuiz } from "../../types/EditQuiz"
import BasicInformation from "./BasicInfo"
import { EditorState } from "../../store/edit/reducers"
import { editedQuizBody } from "../../store/edit/actions"
import { connect } from "react-redux"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
}
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

const EssayQuizEditForm = ({ texts, points, id, editQuizBody }: any) => {
  return (
    <>
      <BasicInformation />
      <br />
      <Typography variant="h3">Editing quiz</Typography>
      <StyledId>{id}</StyledId>
      <QuizCard>
        <QuizHeader>
          <IconWrapper>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </IconWrapper>
          <TitleContainer>
            <div>Quiz name:</div>
            <StyledTextField
              id="quiz-name"
              variant="outlined"
              defaultValue={texts[0].title}
            />
          </TitleContainer>
          <PointsContainer>
            <div>Points:</div>
            <StyledTextField
              id="quiz-points"
              type="number"
              variant="outlined"
              defaultValue={points}
            />
          </PointsContainer>
        </QuizHeader>
        <QuizContent>
          <TextField
            id="quiz-body"
            label="Body"
            variant="outlined"
            multiline
            fullWidth
            rows="2"
            rowsMax="500"
            defaultValue={texts[0].body}
            onChange={event => editQuizBody(event.target.value)}
          />
          <br />
          <br />
          <Button variant="outlined">Add quiz item</Button>
        </QuizContent>
      </QuizCard>
      <DebugDialog />
    </>
  )
}

const mapStateToProps = (state: EditorState): any => {
  return {
    texts: state.texts,
    points: state.points,
    id: state.id,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    editQuizBody: (newBody: string) => dispatch(editedQuizBody(newBody)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EssayQuizEditForm)
