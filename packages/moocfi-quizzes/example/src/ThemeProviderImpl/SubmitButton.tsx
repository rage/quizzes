import * as React from "react"
import styled from "styled-components"
import { SubmitButtonProps } from "../../../src/components/QuizImpl/SubmitButton"

export default (props: SubmitButtonProps) => {
  const StyledSubmitButton = styled.button`
    border: none;
    height: 50px;
    line-height: 50px;
    border-radius: 32px;
    padding: 0 60px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    background: #0d1212;
    color: #f5f9fb;

    :disabled {
      background: #b7b6bc;
      color: #f9f9f9;
    }
  `

  return <StyledSubmitButton {...props} />
}
