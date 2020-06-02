import React from "react"
import { EditableQuiz } from "../../types/EditQuiz"
import { Typography, Card, TextField, IconButton } from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle, faPen } from "@fortawesome/free-solid-svg-icons"
import { connect } from "react-redux"
import { toggleEditable } from "../../store/edit/actions"
import { EditorState } from "../../store/edit/reducers"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
}

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
  quiz,
  id,
  editable,
  numberOfTries,
  pointsToGain,
  pointsGrantingPolicy,
  deadline,
  startStopEditing,
}: any) => {
  return (
    <>
      <InfoCard>
        <InfoHeader>
          <IconWrapper>
            <FontAwesomeIcon icon={faInfoCircle} />
          </IconWrapper>
          <Typography variant="h3">Basic Information</Typography>
        </InfoHeader>
        <InfoContainer>
          <Typography variant="overline">Number of tries allowed:</Typography>
          <TextField
            id={quiz.id + "tries"}
            disabled={editable}
            defaultValue={numberOfTries}
          />
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Points to gain:</Typography>
          <TextField
            id={quiz.id + "points"}
            disabled={editable}
            defaultValue={pointsToGain}
          />
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Points granting policy:</Typography>
          <TextField
            id={quiz.id + "PGP"}
            disabled={editable}
            defaultValue={pointsGrantingPolicy}
          />
        </InfoContainer>
        <InfoContainer>
          <Typography variant="overline">Deadline:</Typography>
          <TextField
            id={quiz.id + "deadline"}
            disabled={editable}
            defaultValue={deadline}
          />
        </InfoContainer>
        <IconButton size="medium" edge="end" onClick={() => startStopEditing()}>
          <FontAwesomeIcon icon={faPen} />
        </IconButton>
      </InfoCard>
    </>
  )
}

export interface editState {
  editable: boolean
}

const mapStateToProps = (state: EditorState) => {
  return {
    editable: state.editable,
    pointsToGain: state.points,
    pointsGrantingPolicy: state.grantPointsPolicy,
    deadline: state.deadline,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    startStopEditing: () => dispatch(toggleEditable),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BasicInformation)
