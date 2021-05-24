import * as React from "react"
import styled from "styled-components"
import { SubmitButtonProps } from "../../../src/components/QuizImpl/SubmitButton"

export default (props: SubmitButtonProps) => {
  const StyledSubmitButton = styled.button``

  return <StyledSubmitButton {...props} />
}
