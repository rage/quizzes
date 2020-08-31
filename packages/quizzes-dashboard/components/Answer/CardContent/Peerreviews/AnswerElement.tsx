import React from "react"
import { AnswerElement } from "../../../../types/Answer"
import {
  Typography,
  Divider,
  FormControlLabel,
  FormGroup,
  Radio,
} from "@material-ui/core"
import styled from "styled-components"

export const StyledText = styled(Typography)`
  display: flex;
  margin-right: 0.5rem !important;
`

export const StyledValue = styled(Typography)`
  display: flex;
  margin-left: 0.5rem !important;
`

export const AnswerElementContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 1rem;
`

export const QuestionContainer = styled.div`
  display: flex;
  width: 100%;
  margin-left: 1rem;
  margin-bottom: 1rem;
`

export const AnswerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
`

export const StyledDivider = styled(Divider)`
  display: flex !important;
  color: blue !important;
  margin: 0.5rem !important;
  width: 100%;
`

const StyledFormLabel = styled(FormControlLabel)`
  margin-left: 0px !important;
  margin-right: 0px !important;
`

const GradeContainer = styled.div`
  display: flex !important;
  width: 100% !important;
  justify-content: center !important;
`

export interface reviewAnswerProps {
  answerElement: AnswerElement
}

export const ReviewAnswerElement = ({ answerElement }: reviewAnswerProps) => {
  const array = [1, 2, 3, 4, 5]
  return (
    <>
      <AnswerElementContainer>
        <QuestionContainer>
          <StyledText variant="h5">
            Question: {answerElement.question.title}
          </StyledText>
        </QuestionContainer>
        <AnswerContainer>
          {answerElement.text !== null ? (
            <StyledText variant="h6">Text: {answerElement.text}</StyledText>
          ) : (
            ""
          )}
          {answerElement.value !== null ? (
            <GradeContainer>
              <FormGroup row>
                {array.map((item, index) => {
                  return (
                    <div key={item}>
                      <StyledFormLabel
                        disabled
                        control={
                          <Radio checked={index + 1 === answerElement.value} />
                        }
                        label={item}
                        labelPlacement="top"
                      />
                    </div>
                  )
                })}
              </FormGroup>
            </GradeContainer>
          ) : (
            ""
          )}
        </AnswerContainer>
        <StyledDivider variant="middle" />
      </AnswerElementContainer>
    </>
  )
}

export default ReviewAnswerElement
