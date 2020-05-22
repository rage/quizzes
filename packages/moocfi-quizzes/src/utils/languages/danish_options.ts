import { SingleLanguageLabels } from "./index"

const danishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Eksempel på svar",
    userAnswerLabel: "Dit svar",
    currentNumberOfWordsLabel: "Ord",
    textFieldLabel: "Dit svar",
    conformToLimitsToSubmitLabel:
      "For at du kan indsende svaret, skal du kontrollere, at det overholder grænsen for antal ord",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Dit svar må ikke overstige ${max} ord`
      }

      if (!max) {
        return `Dit svar skal være på mindst ${min} ord`
      }

      return `Dit svar skal indeholde mellem ${min} og ${max} ord`
    },
  },
  open: {
    placeholder: "Svar",
    userAnswerLabel: "Dit svar",
    feedbackForFailure: "Dit svar er ikke korrekt",
    feedbackForSuccess: "Dit svar er korrekt",
  },
  peerReviews: {
    loadingLabel: "Indlæser",
    noPeerAnswersAvailableLabel: "Der er ingen svar til peer review",
    chooseButtonLabel: "Vælg",
    unselectButtonLabel: "Annuller valg",
    chooseEssayInstruction: "Vælg en mulighed at gennemgå",
    chosenEssayInstruction: "Gennemgå det svar, du har valgt",
    displayPeerReview: "Giv peer review",
    giveExtraPeerReviews:
      "Du har givet det krævede antal peer reviews. Hvis du giver flere peer reviews, gennemgås dit svar hurtigere!",
    giveExtraPeerReviewsQuizConfirmed:
      "Du kan stadig give peer reviews for at hjælpe andre",
    givenPeerReviewsLabel: "Afgivne peer reviews",
    peerReviewsCompletedInfo: "Du har givet nok peer reviews",
    reportAsInappropriateLabel: "Rapporter som spam",
    submitPeerReviewLabel: "Indsend review",
    hidePeerReviewLabel: "Skjul",
    essayQuestionAnswerTextBoxLabel: "Skriv et review",
    optionLabel: "Mulighed",
    answerRejected: "Dit svar er afvist",
    answerFlaggedAsSpam: "Dit svar er rapporteret som spam",
    answerConfirmed: "Dit svar er accepteret!",
    manualReview: "Dit svar gennemgås af kursuspersonalet",
    peerReviewGroupTitle: "Peer reviews",
    peerReviewLikertDetails:
      "Evaluer hver udsagn på en skala fra 1-5. 1 er meget uenig og 5 meget enige.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Der opstod en fejl under visning af de modtagne peer reviews. Genindlæs siden.",
    noSupportForQuestionTypeLabel:
      "Denne type peer review-spørgsmål understøttes ikke",
    loadingLabel: "Indlæser de modtagne peer reviews...",
    noPeerReviewsReceivedlabel:
      "Dit svar har endnu ikke modtaget nogen peer reviews",
    numberOfPeerReviewsText: n =>
      `Dit svar har modtaget ${n} peer review${n > 0 ? "s" : ""}.`,
    toggleButtonExpandLabel: "Vis alle modtagne peer reviews",
    toggleButtonShrinkLabel: "Skjul peer reviews",
    averageOfGradesLabel: "Gennemsnitskarakteren for de modtagne reviews er",
    detailedViewLabel: "Alle de reviews, dit svar har modtaget",
    summaryViewLabel: "Modtagne peer reviews:",
    peerReviewLabel: "Peer review",
    peerReviewReceived: "Du har modtaget et nyt peer review",
    peerReviewReceivedFor: (title: string) =>
      `Du har modtaget et nyt peer review i øvelsen ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Spørgsmål af typen '${itemType}' understøttes ikke.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Vælg det korrekte svar",
    chooseAllSuitableOptionsLabel: "Der kan vælges flere svar.",
    answerCorrectLabel: "Korrekt",
    answerIncorrectLabel: "Forkert",
  },
  stage: {
    answerStageLabel: "Besvarelse af øvelsen",
    givingPeerReviewsStageLabel: "Afgivelse af peer reviews",
    receivingPeerReviewsStageLabel: "Modtagelse af peer reviews",
    evaluationStageLabel: "Afventer vurdering",
  },
  general: {
    pastDeadline: "Du kan ikke længere besvare denne øvelse",
    answerMissingBecauseQuizModifiedLabel:
      "Spørgsmål ikke besvaret. Quizzen er sandsynligvis blevet ændret efter dit svar.",
    submitButtonLabel: "Indsend",
    errorLabel: "Fejl",
    loginToViewPromptLabel: "Log ind for at se øvelsen",
    loginToAnswerPromptLabel: "Log ind for at besvare øvelsen",
    loadingLabel: "Indlæser",
    answerCorrectLabel: "Svaret er korrekt",
    alreadyAnsweredLabel: "Du har allerede besvaret denne",
    answerIncorrectLabel: "Svaret er ikke korrekt",
    kOutOfNCorrect: (k, n) => `${k}/${n} korrekte svar`,
    pointsAvailableLabel: "Tilgængelige point for øvelsen",
    pointsReceivedLabel: "Modtagne point",
    incorrectSubmitWhileTriesLeftLabel:
      "Svaret var ikke helt korrekt. Prøv igen!",
    triesRemainingLabel: "Tilbageværende forsøg",
    quizLabel: "Quiz",
    pointsLabel: "Point",
    triesNotLimitedLabel: "Antal forsøg er ikke begrænset",
    submitGeneralFeedbackLabel: "Indsendt",
    submitButtonAlreadyAnsweredLabel: "Besvaret",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Du kan kun få point, hvis svaret er helt korrekt"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Besvaret",
    unanswered: "Ubesvaret",
    rejected: "Dit svar er afvist, prøv igen",
    progressUpdated: "Kurssipisteesi ovat päivittyneet",
    answerConfirmed: "Vastauksesi on hyväksytty",
    answerConfirmedFor: (title: string) =>
      `Vastauksesi tehtävään ${title} on hyväksytty`,
    courseCompleted: "Olet päässyt läpi kurssista!",
  },
  error: {
    submitFailedError:
      "Vastauksen lähettäminen ei onnistunut. Kokeile myöhemmin uudestaan.",
    quizLoadFailedError: "Tehtävän lataaminen ei onnistunut",
    progressFetchError:
      "Suoritustietojen lataaminen ei onnistunut. Kokeile myöhemmin uudestaan",
    submitSpamFlagError:
      "Asiattomasta vastauksesta ilmoittaminen ei onnistunut",
    fetchReviewCandidatesError:
      "Vastausten lataaminen vertaisarviota varten ei onnistunut. Kokeile myöhemmin uudestaan.",
  },
}

export default finnishLabels
