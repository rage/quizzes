import React from "react"
import {
  Typography,
  Card,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle, faPen } from "@fortawesome/free-solid-svg-icons"
import { connect } from "react-redux"
import {
  editedQuizTitle,
  editedQuizzesNumberOfTries,
  editedQuizzesPointsToGain,
  editedQuizzesPointsGrantingPolicy,
} from "../../store/edit/actions"
import { EditorState } from "../../store/edit/reducers"
import DebugDialog from "../DebugDialog"

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
`

const StyledTextField = styled(TextField)`
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  width: 100%;
  margin-top: 0.25rem !important;
`

const BasicInformation = ({
  id,
  numberOfTries,
  pointsToGain,
  pointsGrantingPolicy,
  deadline,
  texts,
  editedQuizTitle,
  editedNumberOfTries,
  editedPointsToGain,
  editedPointsGrantingPolicy,
}: any) => {
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
            Created at: {new Date(texts[0].createdAt).toDateString()}
          </Typography>
        </InfoContainer>
        <InfoContainer>
          <Typography>
            Last updated at: {new Date(texts[0].updatedAt).toDateString()}
          </Typography>
        </InfoContainer>
        <InfoContainer>
          <Typography>Quiz title:</Typography>
          <StyledTextField
            multiline
            defaultValue={texts[0].title}
            onChange={event => editedQuizTitle(event.target.value)}
          />
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Number of tries allowed:</Typography>
          <Select
            type="number"
            defaultValue={numberOfTries}
            onChange={event => editedNumberOfTries(event.target.value)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Points to gain:</Typography>
          <Select
            type="number"
            defaultValue={pointsToGain}
            onChange={event => editedPointsToGain(event.target.value)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Points granting policy:</Typography>
          <Select
            type="string"
            defaultValue={pointsGrantingPolicy}
            onChange={event => editedPointsGrantingPolicy(event.target.value)}
          >
            <MenuItem value="grant_whenever_possible">
              grant_whenever_possible
            </MenuItem>
            <MenuItem value="grant_only_when_answer_fully_correct">
              grant_only_when_answer_fully_correct
            </MenuItem>
          </Select>
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

export interface editState {
  editable: boolean
}

const mapStateToProps = (state: EditorState) => {
  return {
    id: state.id,
    pointsToGain: state.points,
    pointsGrantingPolicy: state.grantPointsPolicy,
    deadline: state.deadline,
    numberOfTries: state.tries,
    texts: state.texts,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    editedQuizTitle: (newTitle: string) => dispatch(editedQuizTitle(newTitle)),
    editedNumberOfTries: (numberOfTries: number) =>
      dispatch(editedQuizzesNumberOfTries(numberOfTries)),
    editedPointsToGain: (pointsToGain: number) =>
      dispatch(editedQuizzesPointsToGain(pointsToGain)),
    editedPointsGrantingPolicy: (policy: string) =>
      dispatch(editedQuizzesPointsGrantingPolicy(policy)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation)
