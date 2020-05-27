import englishLabels from "./english_options"
import estonianLabels from "./estonian_options"
import finnishLabels from "./finnish_options"
import frenchLabels from "./french_options"
import germanLabels from "./german_options"
import norwegianLabels from "./norwegian_options"
import swedishLabels from "./swedish_options"
import italianLabels from "./italian_options"
import latvianLabels from "./latvian_options"
import hungarianLabels from "./hungarian_options"
import frenchBelgiumLabels from "./french_belgium_options"
import dutchLabels from "./dutch_options"
import danishLabels from "./danish_options"
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
  answered: string
  unanswered: string
  rejected: string
  progressUpdated: string
  answerConfirmed: string
  answerConfirmedFor: (title: string) => string
  courseCompleted: string
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
  unselectButtonLabel: string
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
  essayQuestionAnswerTextBoxLabel: string
  optionLabel: string
  answerRejected: string
  answerFlaggedAsSpam: string
  answerConfirmed: string
  manualReview: string
  peerReviewGroupTitle: string
  peerReviewLikertDetails: string
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
  peerReviewReceived: string
  peerReviewReceivedFor: (title: string) => string
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

export type ErrorLabels = {
  progressFetchError: string
  submitFailedError: string
  quizLoadFailedError: string
  submitSpamFlagError: string
  fetchReviewCandidatesError: string
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
  error: ErrorLabels
}

export type LanguageLabels = {
  [langugeId: string]: SingleLanguageLabels
}

export const languageOptions: LanguageLabels = {
  en_US: englishLabels,
  et_EE: estonianLabels,
  fi_FI: finnishLabels,
  de_DE: germanLabels,
  sv_SE: swedishLabels,
  nb_NO: norwegianLabels,
  fr_FR: frenchLabels,
  fr_BE: frenchBelgiumLabels,
  it_IT: italianLabels,
  lv_LV: latvianLabels,
  hu_HU: hungarianLabels,
  nl_NL: dutchLabels,
  da_DA: danishLabels,
}
