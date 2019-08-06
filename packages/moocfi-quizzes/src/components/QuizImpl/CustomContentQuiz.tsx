import * as React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { useTypedSelector } from "../../state/store"

interface ICustomContentQuizProps {
  content?: Element | JSX.Element
}

const LoginPrompt: React.FunctionComponent<ICustomContentQuizProps> = ({
  content,
}) => {
  const contents = content || <DefaultLoginMessage />
  return <>{contents}</>
}

const DefaultLoginMessage = () => {
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )

  return (
    <MessageContainer>
      <Typography variant="subtitle1">
        {languageLabels
          ? languageLabels.general.loginPromptLabel
          : "Log in to view the quiz."}
      </Typography>
    </MessageContainer>
  )
}

const MessageContainer = styled.div`
  padding: 1rem;
`

export default LoginPrompt
