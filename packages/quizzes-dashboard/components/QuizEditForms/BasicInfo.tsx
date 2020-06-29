import React from "react"
import { Typography, Card, TextField, MenuItem } from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import {
  editedQuizTitle,
  editedQuizzesNumberOfTries,
  editedQuizzesPointsToGain,
  editedQuizzesPointsGrantingPolicy,
} from "../../store/editor/quiz/quizActions"
import DebugDialog from "../DebugDialog"
import { useTypedSelector } from "../../store/store"

const InfoCard = styled(Card)`
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

const InfoHeader = styled.div`
  background-color: rgb(56, 163, 245);
  color: white;
  padding: 1rem;
  display: flex;
`

const InfoContainer = styled.div`
  padding: 1rem;
  display: flex;
`

const InfoContainer2 = styled.div`
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
  editedQuizzesPointsGrantingPolicy,
`

const StyledTextField = styled(TextField)`
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  width: 100%;
  margin-top: 0.25rem !important;
`

const BasicInformation = () => {
  const dispatch = useDispatch()

  const quizId = useTypedSelector(state => state.editor.quizId)

  const quiz = useTypedSelector(state => state.editor.quizzes)
  console.log("quiz", quiz)

  const pointsGrantingPolicy = useTypedSelector(
    state => state.editor.quizzes[quizId].grantPointsPolicy,
  )
  const numberOfTries = useTypedSelector(
    state => state.editor.quizzes[quizId].tries,
  )
  const pointsToGain = useTypedSelector(
    state => state.editor.quizzes[quizId].points,
  )
  const deadline = useTypedSelector(
    state => state.editor.quizzes[quizId].deadline,
  )
  const createdAt = useTypedSelector(
    state => state.editor.quizzes[quizId].createdAt,
  )
  const updatedAt = useTypedSelector(
    state => state.editor.quizzes[quizId].updatedAt,
  )
  const title = useTypedSelector(state => state.editor.quizzes[quizId].title)

  return (
    <>
      <InfoCard>
        <InfoHeader>
          <IconWrapper>
            <FontAwesomeIcon icon={faInfoCircle} />
          </IconWrapper>
          <Typography variant="h3">Quiz Information</Typography>
        </InfoHeader>
        <InfoContainer>
          <Typography>
            Created at: {new Date(createdAt).toDateString()}
          </Typography>
        </InfoContainer>
        <InfoContainer>
          <Typography>
            Last updated at: {new Date(updatedAt).toDateString()}
          </Typography>
        </InfoContainer>
        <InfoContainer>
          <Typography>Quiz title:</Typography>
          <StyledTextField
            multiline
            defaultValue={title}
            onChange={event =>
              dispatch(editedQuizTitle(event.target.value, quizId))
            }
          />
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Number of tries allowed:</Typography>
          <TextField
            type="number"
            defaultValue={numberOfTries}
            onChange={event =>
              dispatch(
                editedQuizzesNumberOfTries(Number(event.target.value), quizId),
              )
            }
          />
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Points to gain:</Typography>
          <TextField
            type="number"
            defaultValue={pointsToGain}
            onChange={event =>
              dispatch(
                editedQuizzesPointsToGain(Number(event.target.value), quizId),
              )
            }
          />
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Points granting policy:</Typography>
          <TextField
            select
            value={pointsGrantingPolicy}
            onChange={event =>
              dispatch(
                editedQuizzesPointsGrantingPolicy(event.target.value, quizId),
              )
            }
          >
            <MenuItem value="grant_whenever_possible">
              grant_whenever_possible
            </MenuItem>
            <MenuItem value="grant_only_when_answer_fully_correct">
              grant_only_when_fully_complete
            </MenuItem>
          </TextField>
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Deadline:</Typography>
          <TextField disabled={true} defaultValue={deadline}></TextField>
        </InfoContainer>
        <InfoContainer>
          <DebugDialog editable={true} />
        </InfoContainer>
      </InfoCard>
    </>
  )
}

export default BasicInformation
