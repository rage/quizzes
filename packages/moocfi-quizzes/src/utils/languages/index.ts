import finnishLabels from "./finnish_options"
import englishLabels from "./english_options"

export type GeneralLabels = {
  quizLabel: string
  submitButtonLabel: string
  loginPromptLabel: string
  errorLabel: string
  loadingLabel: string
  answerCorrectLabel: string
  kOutOfNCorrect: (k: number, n: number) => string
  answerIncorrectLabel: string
  alreadyAnsweredLabel: string
  answerMissingBecauseQuizModifiedLabel: string
  pointsLabel: string
  pointsAvailableLabel: string
  pointsReceivedLabel: string
  incorrectSubmitWhileTriesLeftLabel: string
  triesRemainingLabel: string
  triesNotLimitedLabel: string
  submitGeneralFeedbackLabel: string
}

export type StageLabels = {
  answerStageLabel: string
  givingPeerReviewsStageLabel: string
  receivingPeerReviewsStageLabel: string
  evaluationStageLabel: string
}

export type MultipleChoiceLabels = {
  selectCorrectAnswerLabel: string
  chooseAllSuitableOptionsLabel: string
  answerCorrectLabel: string
  answerIncorrectLabel: string
}

export type EssayLabels = {
  exampleAnswerLabel: string
  userAnswerLabel: string
  currentNumberOfWordsLabel: string
  textFieldLabel: string
  wordLimitsGuidance: (min: number | null, max: number | null) => string
  conformToLimitsToSubmitLabel: string
}

export type PeerReviewLabels = {
  noPeerAnswersAvailableLabel: string
  chooseButtonLabel: string
  chooseEssayInstruction: string
  displayPeerReview: string
  extraPeerReviewsEncouragementLabel: string
  givenPeerReviewsLabel: string
  peerReviewsCompletedInfo: string
  reportAsInappropriateLabel: string
  submitPeerReviewLabel: string
  hidePeerReviewLabel: string
  loadingLabel: string
  quizInvolvesNoPeerReviewsInstruction: string
}

export type UnsupportedLabels = {
  notSupportedInsert: (itemType: string) => string
}

export type OpenLabels = {
  placeholder: string
  userAnswerLabel: string
  feedbackForSuccess: string
  feedbackForFailure: string
}

export type SingleLanguageLabels = {
  essay: EssayLabels
  open: OpenLabels
  peerReviews: PeerReviewLabels
  unsupported: UnsupportedLabels
  multipleChoice: MultipleChoiceLabels
  stage: StageLabels
  general: GeneralLabels
}

export type LanguageLabels = {
  [langugeId: string]: SingleLanguageLabels
}

export const languageOptions: LanguageLabels = {
  fi_FI: finnishLabels,
  en_US: englishLabels,
}
