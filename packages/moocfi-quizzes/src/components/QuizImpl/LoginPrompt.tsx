import * as React from "react"
import styled from "styled-components"
import { Divider, Typography } from "@material-ui/core"
import { useTypedSelector } from "../../state/store"

interface ILoginPromptProps {
  content?: Element | JSX.Element
  fullQuizInfoShown?: boolean
}

const StyledDivider = styled(Divider)`
  height: 2px;
`

const LoginPrompt: React.FunctionComponent<ILoginPromptProps> = ({
  content,
  fullQuizInfoShown,
}) => {
  const contents = content || (
    <DefaultLoginMessage fullQuizInfoShown={fullQuizInfoShown} />
  )
  return <>{contents}</>
}

interface IDefaultLoginMessageProps {
  fullQuizInfoShown?: boolean
}

const DefaultLoginMessage: React.FunctionComponent<
  IDefaultLoginMessageProps
> = ({ fullQuizInfoShown }) => {
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )

  const labelPropertyName = `loginTo${
    fullQuizInfoShown ? "Answer" : "View"
  }PromptLabel`

  return (
    <>
      <MessageContainer fullQuizInfoShown={!!fullQuizInfoShown}>
        <StyledTypography component="p" variant="subtitle1">
          {languageLabels
            ? languageLabels.general[labelPropertyName]
            : `Log in to ${fullQuizInfoShown ? "answer" : "view"} the quiz`}
        </StyledTypography>
      </MessageContainer>
      {fullQuizInfoShown && <StyledDivider variant="fullWidth" />}
    </>
  )
}

interface IMessageContainerProps {
  fullQuizInfoShown: boolean
}

const MessageContainer = styled.div<IMessageContainerProps>`
  padding: 1rem;
  ${({ fullQuizInfoShown }) => (fullQuizInfoShown ? "" : "height: 400px")}
`

const StyledTypography = styled(Typography)`
  font-size: 1.5rem !important;
  text-align: center;
`

export default LoginPrompt
