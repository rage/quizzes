import { SingleLanguageLabels } from "./index"

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Exempelsvar",
    userAnswerLabel: "Ditt svar",
    currentNumberOfWordsLabel: "Antal ord",
    textFieldLabel: "Ditt svar",
    conformToLimitsToSubmitLabel:
      "För att skicka svaret, se till att det är mellan ordgränserna",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Ditt svar borde vara högst ${max} ord lång`
      }

      if (!max) {
        return `Ditt svar borde vara minst ${min} ord lång`
      }

      return `Ditt svar borde vara mellan ${min} och ${max} ord lång`
    },
  },
  open: {
    placeholder: "Svar",
    userAnswerLabel: "Ditt svar",
    feedbackForFailure: "Ditt svar är inte rätt",
    feedbackForSuccess: "Ditt svar är rätt",
  },
  peerReviews: {
    loadingLabel: "Laddas",
    noPeerAnswersAvailableLabel: "Svar för peer review föreliggar inte",
    chooseButtonLabel: "Välj",
    unselectButtonLabel: "Avbryt valet",
    chooseEssayInstruction: "Välj en alternativ för uppskattning",
    chosenEssayInstruction: "Granska det svaret som du valt:",
    displayPeerReview: "Ge peer review",
    giveExtraPeerReviews:
      "Du har redan givit tillräckligt många uppskattningar. Om du skriver ännu mera uppskattningar, ditt svar ska granskas snabbare!",
    giveExtraPeerReviewsQuizConfirmed:
      "Om du vill kan du fortfarande ge peer reviews för att hjälpa andra.",
    givenPeerReviewsLabel: "Antalet givna peer reviews",
    peerReviewsCompletedInfo: "Du har givit tillräckligt peer reviews",
    reportAsInappropriateLabel: "Meddela om osakligt svar",
    submitPeerReviewLabel: "Skicka peer review",
    hidePeerReviewLabel: "Gömma",
    quizInvolvesNoPeerReviewsInstruction:
      "Tähän tehtävään ei liity vertaisarvioita",
    peerReviewsInfoForLoggedOutUser: "Kyselyyn liittyy vertaisarviointiosio",
    essayQuestionAnswerTextBoxLabel: "Skriv en uppskattning",
    optionLabel: "Alternativ",
    answerRejected: "Ditt svar är underkänt",
    answerFlaggedAsSpam: "Ditt svar har rapporteras som spam",
    answerConfirmed: "Ditt svar är godkänt!!",
    manualReview: "Kursens personal håller på att uppskatta ditt svar",
  },
  receivedPeerReviews: {
    errorLabel:
      "Någöt misslyckades med att visa peer reviews. Försök uppdatera webbsidan.",
    noSupportForQuestionTypeLabel: "Den här peer review typen stöds inte",
    loadingLabel: "Laddas mottagna peer reviews...",
    noPeerReviewsReceivedlabel:
      "Ditt svar har inte ännu mottagit peer reviews ",
    numberOfPeerReviewsText: n =>
      `Ditt svar har tagit emot ${n} peer review${n > 0 ? "s" : ""}.`,
    toggleButtonExpandLabel: "Visa alla mottagna peer reviews",
    toggleButtonShrinkLabel: "Gömma peer reviews",
    averageOfGradesLabel: "Det medelvärdet av alla mottagna peer reviews är",
    detailedViewLabel: "Alla uppskattningar som ditt svar har mottagit",
    summaryViewLabel: "Mottagna peer reviews:",
    peerReviewLabel: "Peer review",
    peerReviewReceived: "Du har fått en ny peer review",
    peerReviewReceivedFor: (title: string) =>
      `Du har fått en ny peer review i uppgiften ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Frågtypen ${itemType} stöds inte.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Välj det rätta alternativet",
    chooseAllSuitableOptionsLabel: "Välj alla lämpliga alternativ.",
    answerCorrectLabel: "Rätt",
    answerIncorrectLabel: "Fel",
  },
  stage: {
    answerStageLabel: "Svara på uppgiften",
    givingPeerReviewsStageLabel: "Ge peer reviews",
    receivingPeerReviewsStageLabel: "Svaret mottar peer reviews",
    evaluationStageLabel: "Svaret väntar på bedömning",
  },
  general: {
    pastDeadline: "Du kan inte längre svara den här uppgiften",
    answerMissingBecauseQuizModifiedLabel:
      "Frågan har inte svarats. Sannolikt har uppgiften bearbetats efter ditt svar.",
    submitButtonLabel: "Skicka",
    errorLabel: "Fel",
    loginToViewPromptLabel: "Logga in för att visa uppgiften",
    loginToAnswerPromptLabel: "Logga in för att svara uppgiften",
    loadingLabel: "Laddas",
    answerCorrectLabel: "Svaret är rätt",
    alreadyAnsweredLabel: "Du har redan svarit den här",
    answerIncorrectLabel: "Svaret är inte rätt",
    kOutOfNCorrect: (k, n) => `${k}/${n} rätta svar`,
    pointsAvailableLabel: "Antalet poäng som man kan få från uppgiften",
    pointsReceivedLabel: "Dina poängt",
    incorrectSubmitWhileTriesLeftLabel:
      "Svaret var inte helt rätt. Var snäll och försök på nytt!",
    triesRemainingLabel: "Antalet försök kvar",
    quizLabel: "Quiz",
    pointsLabel: "Poäng",
    triesNotLimitedLabel: "Antalet försök har ingen gräns",
    submitGeneralFeedbackLabel: "Skickat",
    submitButtonAlreadyAnsweredLabel: "Svarat",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Svaret ska vara helt rätt för att tjäna poäng"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    // These three are in elements of ai messages
    answered: "Skickat",
    unanswered: "Vastaamaton",
    rejected: "Vastaus hylätty, yritä uudelleen",
    progressUpdated: "Kurssipisteesi ovat päivittyneet",
    answerConfirmed: "Vastauksesi on hyväksytty",
    answerConfirmedFor: (title: string) =>
      `Vastauksesi tehtävään ${title} on hyväksytty`,
    courseCompleted: "Du har avklarat kursen!",
  },
  error: {
    submitFailedError:
      "Misslyckades att skicka svaret. Försök på nytt senare, tack.",
    quizLoadFailedError:
      "Misslyckades att skicka svaret. Försök på nytt senare, tack.",
    progressFetchError:
      "Suoritustietojen lataaminen ei onnistunut. Kokeile myöhemmin uudestaan",
    submitSpamFlagError:
      "Asiattomasta vastauksesta ilmoittaminen ei onnistunut",
    fetchReviewCandidatesError:
      "Vastausten lataaminen vertaisarviota varten ei onnistunut. Kokeile myöhemmin uudestaan.",
  },
}

export default finnishLabels
