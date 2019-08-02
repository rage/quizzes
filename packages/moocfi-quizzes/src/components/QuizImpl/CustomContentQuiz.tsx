import * as React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import TopInfoBar from "./TopInfoBar"
import { useTypedSelector } from "../../state/store"

interface ICustomContentQuizProps {
  content?: Element | JSX.Element
}

// some of the height depends on rem - might not be exact
const ContentWrapper = styled.div`
  min-height: 460px;
`

const CustomContentQuiz: React.FunctionComponent<ICustomContentQuizProps> = ({
  content,
}) => {
  const contents = content || <DefaultLoginMessage />
  return (
    <>
      <TopInfoBar staticBars={true} />

      <ContentWrapper>{contents}</ContentWrapper>
    </>
  )
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

export default CustomContentQuiz
