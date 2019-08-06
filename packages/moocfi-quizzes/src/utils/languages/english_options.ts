import { SingleLanguageLabels } from "./index"

const englishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Answer example",
    userAnswerLabel: "Your answer",
    currentNumberOfWordsLabel: "Words",
    textFieldLabel: "Your answer",
    conformToLimitsToSubmitLabel:
      "Modify your answer to conform to the word limits to submit",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Your answer should not exceed ${max} words`
      }

      if (!max) {
        return `Your answer should be at least ${min} words long`
      }
      return `Your answer should be between ${min} and ${max} words`
    },
  },
  open: {
    placeholder: "Answer",
    userAnswerLabel: "Your answer",
    feedbackForSuccess: "Your answer is correct",
    feedbackForFailure: "Your answer is incorrect",
  },
  peerReviews: {
    loadingLabel: "Loading",
    chooseButtonLabel: "Choose",
    chooseEssayInstruction: "Choose one of the essays for peer revie",
    givenPeerReviewsLabel: "Peer reviews given",
    noPeerAnswersAvailableLabel: "No answers available for peer review",
    reportAsInappropriateLabel: "Report as inappropriate",
    submitPeerReviewLabel: "Submit review",
    peerReviewsCompletedInfo: "All peer reviews have been submitted",
    extraPeerReviewsEncouragementLabel:
      "You have reviewed the minimum number of peer essays. You may continue to \
        review your peers' works, thereby increasing the probability of your own answer being selected by others!",
    displayPeerReview: "Add peer review",
    hidePeerReviewLabel: "Hide",
    quizInvolvesNoPeerReviewsInstruction: "This quiz involves no peer reviews",
    peerReviewsInfoForLoggedOutUser: "The quiz includes peer reviews",
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Question of type '${itemType}' is not supported.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Select correct answer",
    chooseAllSuitableOptionsLabel: "Choose all suitable options",
    answerCorrectLabel: "Correct",
    answerIncorrectLabel: "Incorrect",
  },
  stage: {
    answerStageLabel: "Answering the quiz",
    givingPeerReviewsStageLabel: "Giving peer reviews",
    receivingPeerReviewsStageLabel: "Receiving peer reviews",
    evaluationStageLabel: "Evaluating the answer",
  },
  general: {
    answerMissingBecauseQuizModifiedLabel:
      "Question not answered. Quiz has probably been modified after your answer.",
    submitButtonLabel: "Submit",
    errorLabel: "Error",
    loginToViewPromptLabel: "Log in to view the quiz",
    loginToAnswerPromptLabel: "Log in to edit the quiz",
    loadingLabel: "Loading",
    answerCorrectLabel: "The answer is correct",
    alreadyAnsweredLabel: "You have already answered",
    answerIncorrectLabel: "The answer is incorrect",
    kOutOfNCorrect: (k, n) => `${k}/${n} answers correct`,
    pointsAvailableLabel: "Points available in the quiz",
    pointsReceivedLabel: "Points awarded to you",
    incorrectSubmitWhileTriesLeftLabel:
      "The answer was incorrect - you may try again!",
    triesRemainingLabel: "Tries remaining",
    quizLabel: "Quiz",
    pointsLabel: "Points",
    triesNotLimitedLabel: "Number of tries is unlimited",
    submitGeneralFeedbackLabel: "Submit successful",
    submitButtonAlreadyAnsweredLabel: "Answered",
  },
}

export default englishLabels
