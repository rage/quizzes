import React, { useEffect } from "react"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers"
import {
  Typography,
  TextField,
  MenuItem,
  Fade,
  Switch,
  FormControlLabel,
} from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import {
  editedQuizTitle,
  editedQuizzesNumberOfTries,
  editedQuizTriesLimited,
  editedQuizzesPointsToGain,
  editedQuizzesPointsGrantingPolicy,
  editedQuizzesDeadline,
  editedQuizzesBody,
  editedQuizzesSubmitmessage,
  editedQuizzesPart,
  editedQuizzesSection,
  editedQuizzesAutoconfirm,
} from "../../store/editor/quiz/quizActions"
import { useTypedSelector } from "../../store/store"
import { checkForChanges } from "../../store/editor/editorActions"
import MarkdownEditor from "../MarkdownEditor"

const SubsectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: center;
`

const WarningWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  height: 35px;
  justify-content: center;
`

const WarningBox = styled.div`
  display: flex;
  border-style: solid;
  border-width: 3px;
  border-color: #f44336;
  width: 50%;
  justify-content: center;
  align-items: baseline !important;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`

const NumberOfTriesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
`
const TryLimitNumberContainer = styled.div`
  width: 50%;
  padding-left: 1rem;
`

const ToggleAndHelperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
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

const PartField = styled(TextField)`
  display: flex;
  margin-right: 0.5rem !important;
`

const SectionField = styled(TextField)`
  display: flex;
  margin-left: 0.5rem !important;
`

const StyledWarningText = styled(Typography)`
  display: flex !important;
  color: #ff5252 !important;
`

const HelperText = styled(Typography)`
  display: flex !important;
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
  color: #9e9e9e !important;
`

const MarginlessHelperText = styled(Typography)`
  display: flex !important;
  margin-bottom: 1rem !important;
  color: #9e9e9e !important;
`

const AutoConfirmSwitch = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 50%;
`

const BasicInformation = () => {
  const dispatch = useDispatch()

  const quizId = useTypedSelector(state => state.editor.quizId)

  const pointsGrantingPolicy = useTypedSelector(
    state => state.editor.quizzes[quizId].grantPointsPolicy,
  )

  const numberOfTries = useTypedSelector(
    state => state.editor.quizzes[quizId].tries,
  )

  const triesAreLimited = useTypedSelector(
    state => state.editor.quizzes[quizId].triesLimited,
  )

  const pointsToGain = useTypedSelector(
    state => state.editor.quizzes[quizId].points,
  )
  const title = useTypedSelector(state => state.editor.quizzes[quizId].title)

  const body = useTypedSelector(state => state.editor.quizzes[quizId].body)

  const submitMessage = useTypedSelector(
    state => state.editor.quizzes[quizId].submitMessage,
  )
  const part = useTypedSelector(state => state.editor.quizzes[quizId].part)

  const section = useTypedSelector(
    state => state.editor.quizzes[quizId].section,
  )

  const variables = useTypedSelector(
    state => state.editor.quizVariables[quizId],
  )

  const store = useTypedSelector(state => state)

  const changes = useTypedSelector(state => state.editor.editorChanges.changes)

  const autoConfirm = useTypedSelector(
    state => state.editor.quizzes[quizId].autoConfirm,
  )

  useEffect(() => {
    dispatch(checkForChanges(store))
  }, [store])

  return (
    <>
      <SubsectionTitleWrapper>
        <TitleIcon icon={faInfoCircle} />
        <Typography variant="h2">Quiz Information</Typography>
      </SubsectionTitleWrapper>

      <WarningWrapper>
        <Fade in={changes} timeout={500}>
          <WarningBox>
            <StyledWarningText variant="overline">
              You have unsaved changes
            </StyledWarningText>
          </WarningBox>
        </Fade>
      </WarningWrapper>

      <InfoContainer>
        <MarkdownEditor
          label="Quiz title"
          text={title ?? ""}
          onChange={event =>
            dispatch(editedQuizTitle(event.target.value, quizId))
          }
        />
      </InfoContainer>
      <InfoContainer>
        <PartField
          fullWidth
          type="number"
          label="Part"
          variant="outlined"
          value={part ?? ""}
          onChange={event =>
            dispatch(editedQuizzesPart(quizId, Number(event.target.value)))
          }
        />
        <SectionField
          fullWidth
          type="number"
          label="Section"
          variant="outlined"
          value={section ?? ""}
          onChange={event =>
            dispatch(editedQuizzesSection(quizId, Number(event.target.value)))
          }
        />
      </InfoContainer>
      <NumberOfTriesContainer>
        <ToggleAndHelperWrapper>
          <FormControlLabel
            id="label"
            control={
              <Switch
                checked={triesAreLimited}
                onChange={event =>
                  dispatch(editedQuizTriesLimited(event.target.checked, quizId))
                }
                color="secondary"
                inputProps={{ "aria-label": "check tries allowed" }}
              />
            }
            label="Limit tries"
            labelPlacement="end"
          />
          <MarginlessHelperText>
            Check this to limit the number of attempts at this quiz
          </MarginlessHelperText>
        </ToggleAndHelperWrapper>
        <TryLimitNumberContainer>
          {triesAreLimited && (
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1, max: null } }}
              label="Number of tries allowed"
              variant="outlined"
              value={numberOfTries ?? ""}
              fullWidth
              onChange={event =>
                dispatch(
                  editedQuizzesNumberOfTries(
                    Number(event.target.value),
                    quizId,
                  ),
                )
              }
            />
          )}
        </TryLimitNumberContainer>
      </NumberOfTriesContainer>
      <InfoContainer>
        <TextField
          label="Points to gain"
          type="number"
          fullWidth
          variant="outlined"
          value={pointsToGain ?? ""}
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
      <InfoContainer>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            fullWidth
            InputLabelProps={{ shrink: !!variables.deadline }}
            value={variables.deadline || ""}
            error={!variables.validDeadline}
            variant="dialog"
            inputVariant="outlined"
            label="Deadline"
            format="dd-MM-yyyy HH:mm"
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
            onChange={event => {
              dispatch(editedQuizzesDeadline(event, quizId))
            }}
            helperText={variables.deadline}
          />
        </MuiPickersUtilsProvider>
      </InfoContainer>
      <InfoContainer>
        <MarkdownEditor
          text={body ?? ""}
          label="Quiz description"
          onChange={event =>
            dispatch(editedQuizzesBody(quizId, event.target.value))
          }
        />
      </InfoContainer>
      <InfoContainer>
        <MarkdownEditor
          text={submitMessage ?? ""}
          label="Submit message"
          onChange={event =>
            dispatch(editedQuizzesSubmitmessage(quizId, event.target.value))
          }
        />
      </InfoContainer>
      <InfoContainer>
        <AutoConfirmSwitch>
          <FormControlLabel
            label="Autoconfirm"
            labelPlacement="end"
            control={
              <Switch
                checked={autoConfirm}
                onChange={event =>
                  dispatch(
                    editedQuizzesAutoconfirm(quizId, event.target.checked),
                  )
                }
              />
            }
          />
          <HelperText>
            When unchecked for a peer reviewed exercise, all answers must be
            reviewed manually
          </HelperText>
        </AutoConfirmSwitch>
      </InfoContainer>
    </>
  )
}

export default BasicInformation
