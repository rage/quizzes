import { SingleLanguageLabels } from "./index"

const norwegianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Eksempelsvar",
    userAnswerLabel: "Ditt svar",
    currentNumberOfWordsLabel: "Ord",
    textFieldLabel: "Ditt svar",
    conformToLimitsToSubmitLabel:
      "Pass på at du holder deg innenfor ordgrensen før du sender inn svaret",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Svaret skal ikke overskride ${max} ord`
      }

      if (!max) {
        return `Svaret skal være minst ${min} ord`
      }

      return `Svaret bør være mellom ${min} og ${max} ord`
    },
  },
  open: {
    placeholder: "Svar",
    userAnswerLabel: "Ditt svar",
    feedbackForFailure: "Svaret ditt er galt",
    feedbackForSuccess: "Svaret ditt er korrekt",
  },
  peerReviews: {
    loadingLabel: "Laster inn",
    noPeerAnswersAvailableLabel:
      "Ingen svar tilgjengelige for fagfellevurdering",
    chooseButtonLabel: "Velg",
    unselectButtonLabel: "Slett valg",
    chooseEssayInstruction: "Velg ett alternativ for vurdering",
    chosenEssayInstruction: "Vurder svaret du valgte:",
    displayPeerReview: "Gi fagfellevurdering",
    giveExtraPeerReviews:
      "Du har gitt nok antall fagfellevurderinger. Hvis du gir enda fler, vil oppgaven din bli vurdert raskere!",
    giveExtraPeerReviewsQuizConfirmed:
      "Du kan fortsatt gi fagfellevurderinger for å hjelpe andre",
    givenPeerReviewsLabel: "Fagfellevurderinger som er gitt",
    peerReviewsCompletedInfo: "Du har gitt nok fagfellevurderinger",
    reportAsInappropriateLabel: "Rapporter som spam",
    submitPeerReviewLabel: "Send inn vurdering",
    hidePeerReviewLabel: "Skjul",
    essayQuestionAnswerTextBoxLabel: "Skriv en vurdering",
    optionLabel: "Alternativ",
    answerRejected: "Svaret ditt er avvist",
    answerFlaggedAsSpam: "Svaret ditt er rapportert som spam",
    answerConfirmed: "Svaret ditt er godkjent!",
    manualReview: "Svaret ditt blir vurdert av kursets ansatte",
    peerReviewGroupTitle: "Fagfellevurderingsspørsmål",
    peerReviewLikertDetails:
      "Evaluer hver uttalelse på en skala fra 1-5. 1 betyr sterkt uenig, 5 betyr veldig enig.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Det oppsto en feil ved visning av mottatte fagfellevurderinger. Prøv å laste inn siden på nytt.",
    noSupportForQuestionTypeLabel:
      "Denne typen fagfellevurderingsspørsmål støttes ikke",
    loadingLabel: "Laster ned mottatte fagfellevurderinger...",
    noPeerReviewsReceivedlabel:
      "Svaret ditt har ikke fått noen fagfellevurderinger",
    numberOfPeerReviewsText: (n) =>
      `Svaret ditt har fått ${n} fagfellevurdering${n > 0 ? "er" : ""}.`,
    toggleButtonExpandLabel: "Vis alle fagfellevurderinger",
    toggleButtonShrinkLabel: "Skjul fagfellevurderinger",
    averageOfGradesLabel:
      "Gjennomsnittlig rangering for alle mottatte vurderinger er",
    detailedViewLabel: "Alle fagfellevurderingene svaret ditt har fått",
    summaryViewLabel: "Mottatte fagfellevurderinger:",
    peerReviewLabel: "Fagfellevurdering",
    peerReviewReceived: "Du har mottatt en ny fagfellevurdering",
    peerReviewReceivedFor: (title: string) =>
      `Du har mottatt en ny fagfellevurdering for trening: ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Spørsmålstype'${itemType}' støttes ikke.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Velg riktig svar",
    chooseAllSuitableOptionsLabel: "Velg  riktige påstander",
    answerCorrectLabel: "Korrekt",
    answerIncorrectLabel: "Galt",
  },
  stage: {
    answerStageLabel: "Å svare på oppgaven",
    givingPeerReviewsStageLabel: "Å gi fagfellevurderinger",
    receivingPeerReviewsStageLabel: "Å motta fagfellevurderinger",
    evaluationStageLabel: "Å vente på en evaluering",
  },
  general: {
    pastDeadline: "Du kan ikke lenger svare på denne oppgaven.",
    answerMissingBecauseQuizModifiedLabel:
      "Spørsmålet er ikke besvart. Oppgaven har sannsynligvis endret seg etter svar.",
    submitButtonLabel: "Send inn",
    errorLabel: "Feil",
    loginToViewPromptLabel: "Logg inn for å se oppgaven",
    loginToAnswerPromptLabel: "Logg inn for å svare på oppgaven",
    loadingLabel: "Laster inn",
    answerCorrectLabel: "Svaret er korrekt",
    alreadyAnsweredLabel: "Du har allerede besvart dette",
    answerIncorrectLabel: "Svaret er galt",
    kOutOfNCorrect: (k, n) => `${k}/${n} svar er korrekt`,
    pointsAvailableLabel: "Poeng tilgjengelig",
    pointsReceivedLabel: "Din poengsum",
    incorrectSubmitWhileTriesLeftLabel:
      "Svaret ditt var ikke 100% korrekt. Prøv igjen!",
    triesRemainingLabel: "Antall gjenværende forsøk",
    quizLabel: "Quiz",
    pointsLabel: "Poeng",
    triesNotLimitedLabel: "Antall forsøk er ikke begrenset",
    submitGeneralFeedbackLabel: "Sendt",
    submitButtonAlreadyAnsweredLabel: "Besvart",
    pointsGrantingPolicyInformer: (policy) => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "For å få poeng må svaret være 100% korrekt"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Besvart",
    unanswered: "Ubesvart",
    rejected: "Avvist svar, prøv igjen",
    progressUpdated: "Kursens fremgang oppdatert",
    answerConfirmed: "Svaret ditt ble bekreftet!",
    answerConfirmedFor: (title: string) =>
      `Svaret ditt på oppgave ${title} ble bekreftet!`,
    courseCompleted: "Du har fullført kurset!",
  },
  error: {
    submitFailedError: "Kunne ikke sende svaret. Prøv igjen senere.",
    quizLoadFailedError: "Kunne ikke laste opp øvelsen",
    progressFetchError:
      "Kunne ikke hente fremdriftsdata for kurset. Prøv igjen senere.",
    submitSpamFlagError: "Kunne ikke rapportere spam",
    fetchReviewCandidatesError:
      "Noe gikk galt mens du hentet svar for fagfellevurdering. Prøv igjen senere.",
  },
}

export default norwegianLabels
