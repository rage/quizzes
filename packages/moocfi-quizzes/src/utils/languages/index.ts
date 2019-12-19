import finnishLabels from "./finnish_options"
import englishLabels from "./english_options"
import { QuizPointsGrantingPolicy } from "../../modelTypes"

export type GeneralLabels = {
  [index: string]: string | Function
  quizLabel: string
  submitButtonLabel: string
  loginToViewPromptLabel: string
  loginToAnswerPromptLabel: string
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
  submitButtonAlreadyAnsweredLabel: string
  pointsGrantingPolicyInformer: (policy: QuizPointsGrantingPolicy) => string
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
  chosenEssayInstruction: string
  displayPeerReview: string
  giveExtraPeerReviews: string
  giveExtraPeerReviewsQuizConfirmed: string
  givenPeerReviewsLabel: string
  peerReviewsCompletedInfo: string
  reportAsInappropriateLabel: string
  submitPeerReviewLabel: string
  hidePeerReviewLabel: string
  loadingLabel: string
  quizInvolvesNoPeerReviewsInstruction: string
  peerReviewsInfoForLoggedOutUser: string
  essayQuestionAnswerTextBoxLabel: string
  optionLabel: string
  answerRejected: string
  answerFlaggedAsSpam: string
  answerConfirmed: string
  manualReview: string
}

export type ReceivedPeerReviewLabels = {
  loadingLabel: string
  errorLabel: string
  noPeerReviewsReceivedlabel: string
  toggleButtonExpandLabel: string
  toggleButtonShrinkLabel: string
  numberOfPeerReviewsText: (n: number) => string
  averageOfGradesLabel: string
  noSupportForQuestionTypeLabel: string
  detailedViewLabel: string
  summaryViewLabel: string
  peerReviewLabel: string
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
  receivedPeerReviews: ReceivedPeerReviewLabels
}

export type LanguageLabels = {
  [langugeId: string]: SingleLanguageLabels
}

export const languageOptions: LanguageLabels = {
  fi_FI: finnishLabels,
  en_US: englishLabels,
}
