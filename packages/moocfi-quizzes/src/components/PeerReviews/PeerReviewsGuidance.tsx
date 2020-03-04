import * as React from "react"
import styled from "styled-components"

import { useTypedSelector } from "../../state/store"

import { Typography } from "@material-ui/core"
import {
  TopMarginDivSmall,
  BoldTypographyLarge,
  withMargin,
  BoldTypography,
} from "../styleComponents"
import MarkdownText from "../MarkdownText"

type PeerReviewsGuidanceProps = {
  givenLabel: string
  peerReviewsCompletedInfo: string
  guidanceText: string
}

const PeerReviewsGuidance: React.FunctionComponent<
  PeerReviewsGuidanceProps
> = ({ givenLabel, guidanceText, peerReviewsCompletedInfo }) => {
  const quiz = useTypedSelector(state => state.quiz)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const given = userQuizState ? userQuizState.peerReviewsGiven : 0
  const required = (quiz && quiz.course.minPeerReviewsGiven) || 0

  const GivenCount = withMargin(BoldTypographyLarge, "2rem 0 0 ")
  const Instructions = withMargin(MarkdownText, "1.5rem 0 0 ")

  return (
    <>
      <GivenCount component="p" variant="subtitle1" >
        {givenLabel}: {given}/{required}
      </GivenCount>
      <Instructions Component="p">{guidanceText}</Instructions>
    </>
  )
}

export default PeerReviewsGuidance
