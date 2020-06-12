import * as React from "react"
import styled from "styled-components"
import ThemeProviderContext from "../../contexes/themeProviderContext"

import { useTypedSelector } from "../../state/store"
import { BoldTypographyLarge, withMargin } from "../styleComponents"
import MarkdownText from "../MarkdownText"

const Guidance = styled.div<{ providedStyles?: string }>`
  ${({ providedStyles }) => providedStyles}
`

type PeerReviewsGuidanceProps = {
  givenLabel: string
  peerReviewsCompletedInfo: string
  guidanceText: string
}

const PeerReviewsGuidance: React.FunctionComponent<PeerReviewsGuidanceProps> = ({
  givenLabel,
  guidanceText,
  peerReviewsCompletedInfo,
}) => {
  const themeProvider = React.useContext(ThemeProviderContext)
  const quiz = useTypedSelector((state) => state.quiz)
  const userQuizState = useTypedSelector((state) => state.user.userQuizState)
  const given = userQuizState ? userQuizState.peerReviewsGiven : 0
  const required = (quiz && quiz.course.minPeerReviewsGiven) || 0

  const GivenCount = withMargin(BoldTypographyLarge, "2rem 0 0 ")
  const Instructions = withMargin(MarkdownText, "1.5rem 0 0 ")
  React.useEffect(() => console.log("Title rerenders"))

  return (
    <Guidance providedStyles={themeProvider.peerReviewGuidanceStyles}>
      <GivenCount component="p" variant="subtitle1">
        {givenLabel}: {given}/{required}
      </GivenCount>
      <Instructions Component="p">{guidanceText}</Instructions>
    </Guidance>
  )
}

export default PeerReviewsGuidance
