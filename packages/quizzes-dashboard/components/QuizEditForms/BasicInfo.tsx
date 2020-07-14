import React from "react"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers"
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
  editedQuizzesDeadline,
  editedQuizzesBody,
  editedQuizzesSubmitmessage,
} from "../../store/editor/quiz/quizActions"
import { useTypedSelector } from "../../store/store"
import { listTimeZones } from "timezone-support"
import { setTimezone } from "../../store/editor/editorActions"
import { DateTime } from "luxon"
import { isDate } from "lodash"

const SubsectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: center;
`

const InfoContainer = styled.div`
  padding: 1rem 0;
  display: flex;
`

const TitleIcon = styled(FontAwesomeIcon)`
  width: 2rem;
  height: 2rem;
  margin-right: 0.25rem;
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
  const title = useTypedSelector(state => state.editor.quizzes[quizId].title)

  const body = useTypedSelector(state => state.editor.quizzes[quizId].body)

  const submitMessage = useTypedSelector(
    state => state.editor.quizzes[quizId].submitMessage,
  )

  const variables = useTypedSelector(
    state => state.editor.quizVariables[quizId],
  )

  return (
    <>
      <SubsectionTitleWrapper>
        <TitleIcon icon={faInfoCircle} />
        <Typography variant="h2">Quiz Information</Typography>
      </SubsectionTitleWrapper>

      <InfoContainer>
        <TextField
          label="Quiz Title"
          fullWidth
          variant="outlined"
          defaultValue={title}
          onChange={event =>
            dispatch(editedQuizTitle(event.target.value, quizId))
          }
        />
      </InfoContainer>
      <InfoContainer>
        <TextField
          label="Number of tries allowed"
          fullWidth
          variant="outlined"
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
        <TextField
          label="Points to gain"
          fullWidth
          variant="outlined"
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
        <TextField
          fullWidth
          label="Points granting policy"
          variant="outlined"
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <InfoContainer>
          <KeyboardDateTimePicker
            value={deadline}
            fullWidth
            variant="dialog"
            inputVariant="outlined"
            id="time-picker"
            label="Time picker"
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
            onChange={event => {
              dispatch(
                editedQuizzesDeadline(
                  event,
                  variables.deadlineTimeZone,
                  quizId,
                ),
              )
            }}
          />
          <TextField
            select
            fullWidth
            label="timezone"
            variant="outlined"
            value={variables.deadlineTimeZone ?? ""}
            onChange={event => {
              dispatch(setTimezone(quizId, event.target.value))
            }}
          >
            {listTimeZones().map(timezone => (
              <MenuItem key={timezone} value={timezone}>
                {timezone}
              </MenuItem>
            ))}
          </TextField>
        </InfoContainer>
      </MuiPickersUtilsProvider>
      <InfoContainer>
        <TextField
          multiline
          fullWidth
          rows={5}
          label="Description for the whole quiz"
          variant="outlined"
          value={body}
          onChange={event =>
            dispatch(editedQuizzesBody(quizId, event.target.value))
          }
        />
      </InfoContainer>
      <InfoContainer>
        <TextField
          multiline
          rows={5}
          label="Submit message"
          fullWidth
          variant="outlined"
          value={submitMessage}
          onChange={event =>
            dispatch(editedQuizzesSubmitmessage(quizId, event.target.value))
          }
        />
      </InfoContainer>
    </>
  )
}

export default BasicInformation
