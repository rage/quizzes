import { SingleLanguageLabels } from "./index"

const dutchLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Voorbeeldantwoord",
    userAnswerLabel: "Uw antwoord",
    currentNumberOfWordsLabel: "Woorden",
    textFieldLabel: "Uw antwoord",
    conformToLimitsToSubmitLabel:
      "Zorg ervoor dat uw antwoord het juiste aantal woorden bevat",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Uw antwoord mag niet langer zijn dan ${max} woorden`
      }

      if (!max) {
        return `Uw antwoord moet minstens ${min} woorden lang zijn`
      }

      return `Uw antwoord moet tussen de  ${min} en ${max} woorden lang zijn`
    },
  },
  open: {
    placeholder: "Antwoord",
    userAnswerLabel: "Uw antwoord",
    feedbackForFailure: "Uw antwoord is onjuist",
    feedbackForSuccess: "Uw antwoord is juist",
    yourAnswerIsNotFormattedCorrectly:
      "Uw antwoord is niet correct geformatteerd",
  },
  peerReviews: {
    loadingLabel: "Laden",
    noPeerAnswersAvailableLabel: "Geen antwoorden beschikbaar voor beoordeling",
    chooseButtonLabel: "Selecteren",
    unselectButtonLabel: "Selectie annuleren",
    chooseEssayInstruction: "Kies één optie om te beoordelen",
    chosenEssayInstruction: "Beoordeel het geselecteerde antwoord",
    displayPeerReview: "Beoordelen",
    giveExtraPeerReviews:
      "U heeft het vereiste aantal antwoorden beoordeeld. Beoordeel meer antwoorden en uw eigen antwoord wordt sneller beoordeeld!",
    giveExtraPeerReviewsQuizConfirmed:
      "U kunt meer antwoorden beoordelen om anderen te helpen",
    givenPeerReviewsLabel: "Verzonden beoordelingen",
    peerReviewsCompletedInfo: "U heeft genoeg antwoorden beoordeeld",
    reportAsInappropriateLabel: "Spam melden",
    submitPeerReviewLabel: "Beoordeling verzenden",
    hidePeerReviewLabel: "Verbergen",
    essayQuestionAnswerTextBoxLabel: "Beoordeling schrijven",
    optionLabel: "Optie",
    answerRejected: "Uw antwoord is geweigerd",
    answerFlaggedAsSpam: "Uw antwoord is gerapporteerd als spam",
    answerConfirmed: "Uw antwoord is geaccepteerd!",
    manualReview: "Uw antwoord wordt beoordeeld door een cursusmedewerker",
    peerReviewGroupTitle: "Beoordeelde vragen",
    peerReviewLikertDetails:
      "Evalueer elke stelling op een schaal van 1-5. Ik ben het er zeer mee oneens en 5 is het er volledig mee eens.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Er is een fout opgetreden bij het weergeven van de ontvangen beoordelingen. Probeer de pagina opnieuw te laden.",
    noSupportForQuestionTypeLabel:
      "Een dergelijke beoordelingsvraag wordt niet ondersteund",
    loadingLabel: "Ontvangen beoordelingen laden...",
    noPeerReviewsReceivedlabel: "Uw antwoord is nog niet beoordeeld",
    numberOfPeerReviewsText: n => `Uw antwoord is ${n} keer beoordeeld.`,
    toggleButtonExpandLabel: "Toon alle ontvangen beoordelingen",
    toggleButtonShrinkLabel: "Verberg beoordelingen",
    averageOfGradesLabel:
      "Het gemiddelde cijfer van de ontvangen beoordelingen is",
    detailedViewLabel: "Alle ontvangen beoordelingen van uw antwoord",
    summaryViewLabel: "Ontvangen beoordelingen:",
    peerReviewLabel: "Beoordeling",
    peerReviewReceived: "U heeft een nieuwe beoordeling ontvangen",
    peerReviewReceivedFor: (title: string) =>
      `U heeft een nieuwe beoordeling ontvangen voor oefening ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Vragen van het volgende type worden niet ondersteund: ${itemType}`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Kies het juiste antwoord",
    chooseAllSuitableOptionsLabel: "Meer dan één antwoord mogelijk",
    answerCorrectLabel: "Juist",
    answerIncorrectLabel: "Onjuist",
    selectOption: "select an option",
  },
  stage: {
    answerStageLabel: "Oefening aan het beantwoorden",
    givingPeerReviewsStageLabel: "Beoordelen",
    receivingPeerReviewsStageLabel: "Beoordelingen ontvangen",
    evaluationStageLabel: "Aan het wachten op cijfer",
  },
  general: {
    pastDeadline: "U kunt de oefening niet meer beantwoorden",
    answerMissingBecauseQuizModifiedLabel:
      "Vraag niet beantwoord. De quiz is waarschijnlijk gewijzigd nadat u hebt geantwoord.",
    submitButtonLabel: "Verzenden",
    errorLabel: "Fout",
    loginToViewPromptLabel: "Log in om de oefening te bekijken",
    loginToAnswerPromptLabel: "Log in om de oefening te beantwoorden",
    loadingLabel: "Laden",
    answerCorrectLabel: "Het antwoord is juist",
    alreadyAnsweredLabel: "U heeft deze vraag al beantwoord",
    answerIncorrectLabel: "Het antwoord is onjuist",
    kOutOfNCorrect: (k, n) => `${k}/${n} antwoorden juist`,
    pointsAvailableLabel: "Totaal aantal punten voor deze oefening",
    pointsReceivedLabel: "Behaalde punten",
    incorrectSubmitWhileTriesLeftLabel:
      "Het antwoord is niet helemaal juist. Probeer het opnieuw!",
    triesRemainingLabel: "Resterende pogingen",
    quizLabel: "Quiz",
    pointsLabel: "Punten",
    triesNotLimitedLabel: "U kunt zo vaak proberen als u wilt",
    submitGeneralFeedbackLabel: "Verzonden",
    submitButtonAlreadyAnsweredLabel: "Beantwoord",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "U krijgt pas punten als het antwoord helemaal juist is"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Beantwoord",
    unanswered: "Onbeantwoord",
    rejected: "Uw antwoord is geweigerd, probeer het opnieuw",
    progressUpdated: "Voortgang is geüpdatet",
    answerConfirmed: "Uw antwoord is bevestigd!",
    answerConfirmedFor: (title: string) =>
      `U antwoord voor oefening ${title} is bevestigd!`,
    courseCompleted: "U heeft de cursus afgerond!",
  },
  error: {
    submitFailedError:
      "Uw antwoord kon niet worden verzonden. Probeer het later opnieuw.",
    quizLoadFailedError: "Kan oefening niet laden",
    progressFetchError:
      "Kan voortganggegevens niet ophalen. Probeer het later opnieuw.",
    submitSpamFlagError: "Kan spam niet melden",
    fetchReviewCandidatesError:
      "Er is iets misgegaan bij het ophalen van de antwoorden voor beoordeling. Probeer het later opnieuw.",
  },
}

export default dutchLabels
