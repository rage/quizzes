import { SingleLanguageLabels } from "./index"

const englishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Example answer",
    userAnswerLabel: "Your answer",
    currentNumberOfWordsLabel: "Words",
    textFieldLabel: "Your answer",
    conformToLimitsToSubmitLabel:
      "To be able to submit the answer, make sure it conforms to the word limits",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Your answer should not exceed ${max} words`
      }

      if (!max) {
        return `Your answer should be at least ${min} words`
      }
      return `Your answer should be between ${min} and ${max} words`
    },
  },
  open: {
    placeholder: "Answer",
    userAnswerLabel: "Your answer",
    feedbackForSuccess: "Your answer is correct",
    feedbackForFailure: "Your answer is not correct",
  },
  peerReviews: {
    loadingLabel: "Loading",
    chooseButtonLabel: "Select",
    unselectButtonLabel: "Cancel selection",
    chooseEssayInstruction: "Choose one option to review",
    chosenEssayInstruction: "Review the answer you selected",
    givenPeerReviewsLabel: "Peer reviews given",
    noPeerAnswersAvailableLabel: "No answers available for peer review",
    reportAsInappropriateLabel: "Report as spam",
    submitPeerReviewLabel: "Submit review",
    peerReviewsCompletedInfo: "You have given enough peer reviews",
    giveExtraPeerReviews:
      "You have given the required number of peer reviews. If you give more peer reviews your answer will be reviewed faster!",
    giveExtraPeerReviewsQuizConfirmed:
      "You may still give peer reviews to help others",
    displayPeerReview: "Give peer review",
    hidePeerReviewLabel: "Hide",
    quizInvolvesNoPeerReviewsInstruction: "This quiz involves no peer reviews",
    peerReviewsInfoForLoggedOutUser: "The quiz includes peer reviews",
    essayQuestionAnswerTextBoxLabel: "Write a review",
    optionLabel: "Option",
    answerRejected: "Your answer has been rejected",
    answerFlaggedAsSpam: "Your answer has been reported as spam",
    answerConfirmed: "Your answer has been accepted!",
    manualReview: "Your answer is being reviewed by course staff",
    peerReviewGroupTitle:"Vertaisarviointikysymykset",
    peerReviewLikertDetails:"Arvioi jokainen väite asteikolla 1-5. 1 on vahvasti eri mieltä ja 5 on vahvasti samaa mieltä."
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "The average grade of received reviews is",
    detailedViewLabel: "All the reviews your answer has received",
    errorLabel:
      "An error occurred in displaying the peer reviews you've received. Reloading the page could help",
    loadingLabel: "Loading the received peer reviews...",
    noPeerReviewsReceivedlabel:
      "Your answer has not yet received any peer reviews",
    noSupportForQuestionTypeLabel:
      "This kind of peer review question is not supported",
    numberOfPeerReviewsText: n =>
      `Your answer has received ${n} peer review${n > 1 ? "s" : ""}.`,
    summaryViewLabel: "Received peer reviews:",
    toggleButtonExpandLabel: "Show all received peer reviews",
    toggleButtonShrinkLabel: "Hide",
    peerReviewLabel: "Peer review",
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Question of type '${itemType}' is not supported.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Select the correct answer",
    chooseAllSuitableOptionsLabel: "Select all that apply",
    answerCorrectLabel: "Correct",
    answerIncorrectLabel: "Incorrect",
  },
  stage: {
    answerStageLabel: "Answering the exercise",
    givingPeerReviewsStageLabel: "Giving peer reviews",
    receivingPeerReviewsStageLabel: "Receiving peer reviews",
    evaluationStageLabel: "Waiting to be graded",
  },
  general: {
    pastDeadline: "You can no longer give an answer to this exercise",
    answerMissingBecauseQuizModifiedLabel:
      "Question not answered. Quiz has probably been modified after your answer.",
    submitButtonLabel: "Submit",
    errorLabel: "Error",
    loginToViewPromptLabel: "Log in to view the exercise",
    loginToAnswerPromptLabel: "Log in to answer the exercise",
    loadingLabel: "Loading",
    answerCorrectLabel: "The answer is correct",
    alreadyAnsweredLabel: "You have already answered this",
    answerIncorrectLabel: "The answer is not correct",
    kOutOfNCorrect: (k, n) => `${k}/${n} answers correct`,
    pointsAvailableLabel: "Points available for the exercise",
    pointsReceivedLabel: "Received points",
    incorrectSubmitWhileTriesLeftLabel:
      "The answer was not fully correct. Please try again!",
    triesRemainingLabel: "Tries remaining",
    quizLabel: "Quiz",
    pointsLabel: "Points",
    triesNotLimitedLabel: "The number of tries is not limited",
    submitGeneralFeedbackLabel: "Submitted",
    submitButtonAlreadyAnsweredLabel: "Answered",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "To receive points the answer must be fully correct"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Answered",
    unanswered: "Unanswered",
    rejected: "Rejected answer, try again",
  },
  error: {
    submitFailedError: "Could not send your answer. Please try again later.",
    quizLoadFailedError: "Could not load the exercise",
  },
}

export default englishLabels
