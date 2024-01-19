import { SingleLanguageLabels } from "./index"

const swedishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Exempelsvar",
    userAnswerLabel: "Ditt svar",
    currentNumberOfWordsLabel: "Antal ord",
    textFieldLabel: "Ditt svar",
    conformToLimitsToSubmitLabel:
      "För att kunna skicka ditt svar, bearbeta det inom det begränsade ordantalet.",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Ditt svar bör inte överskrida ${max} ord.`
      }

      if (!max) {
        return `Ditt svar bör vara minst ${min} ord`
      }

      return `Ditt svar bör vara mellan ${min} och ${max} ord`
    },
  },
  open: {
    placeholder: "Svar",
    userAnswerLabel: "Ditt svar",
    feedbackForFailure: "Ditt svar är fel",
    feedbackForSuccess: "Ditt svar är rätt",
    yourAnswerIsNotFormattedCorrectly: "Ditt svar är inte korrekt formaterat",
  },
  peerReviews: {
    loadingLabel: "Laddar",
    noPeerAnswersAvailableLabel:
      "Inga svar tillgängliga för kollegial bedömning",
    chooseButtonLabel: "Välj",
    unselectButtonLabel: "Upphäv valet",
    chooseEssayInstruction: "Välj ett alternativ för bedömning",
    chosenEssayInstruction: "Bedöm det svar som du valde:",
    displayPeerReview: "Ge kollegial bedömning",
    giveExtraPeerReviews:
      "Du har gett det krävda antalet kollegiala bedömningar. Om du ger flera kollegiala bedömningar, bedöms dina svar snabbare!",
    giveExtraPeerReviewsQuizConfirmed:
      "Om du vill kan du ge ännu fler kollegiala bedömningar för att hjälpa andra.",
    givenPeerReviewsLabel: "Kollegiala bedömningar givna",
    peerReviewsCompletedInfo:
      "Du har gett tillräckligt många kollegiala bedömningar.",
    reportAsInappropriateLabel: "Anmäl om osakligt svar",
    submitPeerReviewLabel: "Skicka den kollegiala bedömningen",
    hidePeerReviewLabel: "Göm",
    essayQuestionAnswerTextBoxLabel: "Skriv en bedömning",
    optionLabel: "Alternativ",
    answerRejected: "Ditt svar är inte godkänt",
    answerFlaggedAsSpam: "Ditt svar har underkänts som osakligt",
    answerConfirmed: "Ditt svar är godkänt!",
    manualReview: "Ditt svar väntar på bedömning av kurspersonalen",
    peerReviewGroupTitle: "Kollegiala bedömningsfrågor",
    peerReviewLikertDetails:
      "Bedöm varje uttalande på en skala från 1-5. 1: håller starkt emot, 5: håller starkt för.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Det förekom ett fel i visningen av inlämnade bedömningar. Vänligen försök ladda sidan på nytt.",
    noSupportForQuestionTypeLabel:
      "Den här typen av kollegial bedömningsfråga stöds inte",
    loadingLabel: "Laddar inkomna kollegiala bedömningar...",
    noPeerReviewsReceivedlabel:
      "Ditt svar har inte ännu fått kollegial bedömning",
    numberOfPeerReviewsText: n =>
      `Ditt svar har fått ${n} kollegial${n > 0 ? "a" : ""} bedömning${
        n > 0 ? "ar" : ""
      }`,
    toggleButtonExpandLabel: "Visa alla inkomna kollegiala bedömningar",
    toggleButtonShrinkLabel: "Göm kollegiala bedömningar",
    averageOfGradesLabel: "Medeltalet för alla bedömningar är",
    detailedViewLabel: "Alla bedömningar till ditt svar",
    summaryViewLabel: "Mottagna kollegiala bedömningar:",
    peerReviewLabel: "Kollegial bedömning",
    peerReviewReceived: "Du har fått en ny kollegial bedömning",
    peerReviewReceivedFor: (title: string) =>
      `Du har fått en ny kollegial bedömning i uppgift ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) => `Frågtypen ${itemType} stöds ej.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Välj rätt svar",
    chooseAllSuitableOptionsLabel: "Välj alla passande alternativ",
    answerCorrectLabel: "Rätt",
    answerIncorrectLabel: "Fel",
    selectOption: "välj ett alternativ",
  },
  stage: {
    answerStageLabel: "Att ge svar på uppgiften",
    givingPeerReviewsStageLabel: "Att ge kollegial bedömning",
    receivingPeerReviewsStageLabel: "Att ta emot kollegial bedömning",
    evaluationStageLabel: "Att vänta på bedömning",
  },
  general: {
    pastDeadline: "Du kan inte längre besvara denna uppgift.",
    answerMissingBecauseQuizModifiedLabel:
      "Frågan är obesvarad. Uppgiften har troligtvis ändrats efter ditt svar.",
    submitButtonLabel: "Svara",
    errorLabel: "Fel",
    loginToViewPromptLabel: "Logga in för att se uppgiften",
    loginToAnswerPromptLabel: "Logga in för att svara på uppgiften",
    loadingLabel: "Laddar",
    answerCorrectLabel: "Svaret är rätt",
    alreadyAnsweredLabel: "Du har redan besvarat denna fråga",
    answerIncorrectLabel: "Svaret är fel",
    kOutOfNCorrect: (k, n) => `Du fick ${k}/${n} rätt`,
    pointsAvailableLabel: "Möjliga poäng för denna uppgift",
    pointsReceivedLabel: "Dina poäng",
    incorrectSubmitWhileTriesLeftLabel:
      "Ditt svar var inte helt rätt. Vänligen, försök igen!",
    triesRemainingLabel: "Antal försök kvar",
    quizLabel: "Frågesport",
    pointsLabel: "Poäng",
    triesNotLimitedLabel: "Antalen försök är inte begränsade",
    submitGeneralFeedbackLabel: "Inlämnad",
    submitButtonAlreadyAnsweredLabel: "Besvarad",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "För att få poäng måste svaret vara helt rätt"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    // These three are in elements of ai messages
    answered: "Skickat",
    unanswered: "Obesvarad",
    rejected: "Ditt svar är inte godkänt, försök igen",
    progressUpdated: "Dina kurspoäng har uppdaterats",
    answerConfirmed: "Ditt svar är godkänt",
    answerConfirmedFor: (title: string) =>
      `Ditt svar på uppgift ${title} är godkänt!`,
    courseCompleted: "Du har avklarat kursen!",
  },
  error: {
    submitFailedError: "Ditt svar kunde inte skickas. Försök igen senare.",
    quizLoadFailedError: "Uppgiften kunde inte laddas. Försök igen senare.",
    progressFetchError:
      "Framstegsinformationen kunde inte laddas. Försök igen senare.",
    submitSpamFlagError: "Anmälan av ett osakligt svar kunde inte skickas.",
    fetchReviewCandidatesError:
      "Svaralternativ för kollegial bedömning kunde inte laddas. Försök igen senare.",
  },
}

export default swedishLabels
