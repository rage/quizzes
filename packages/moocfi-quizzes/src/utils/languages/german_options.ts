import { SingleLanguageLabels } from "./index"

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Musterantwort",
    userAnswerLabel: "Deine Antwort",
    currentNumberOfWordsLabel: "Wörter",
    textFieldLabel: "Deine Antwort",
    conformToLimitsToSubmitLabel:
      "Um die Antwort senden zu können, bitte die Länge anpassen",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Deine Antwort darf höchstens ${max} Wörter haben`
      }

      if (!max) {
        return `Deine Antwort muss mindestens ${min} Wörter haben`
      }

      return `Deine Antwort muss ${min} bis${max} Wörter haben`
    },
  },
  open: {
    placeholder: "Wörter",
    userAnswerLabel: "Deine Antwort",
    feedbackForFailure: "Deine Antwort ist nicht richtig",
    feedbackForSuccess: "Deine Antwort ist richtig",
  },
  peerReviews: {
    loadingLabel: "Wird geladen",
    noPeerAnswersAvailableLabel:
      "Keine Antworten, die auf eine Peer-Evaluation warten",
    chooseButtonLabel: "Auswählen",
    unselectButtonLabel: "Auswahl löschen",
    chooseEssayInstruction: "Wähle eine der Alternativen zur Evaluation",
    chosenEssayInstruction: "Evaluiere die gewählte Antwort:",
    displayPeerReview: "Peer-Evaluation abgeben",
    giveExtraPeerReviews:
      "Du hast die notwendige an Anzahl Peer-Evaluationen abgegeben. Wenn du noch weitere Antworten bewertest, wird deine Antwort schneller evaluiert!",
    giveExtraPeerReviewsQuizConfirmed:
      "Du kannst noch weitere Peer-Evaluation abgeben, um anderen zu helfen",
    givenPeerReviewsLabel: "Abgegebene Peer-Evaluationen",
    peerReviewsCompletedInfo: "Du hast genug Peer-Evaluationen abgegeben",
    reportAsInappropriateLabel: "Als Spam melden",
    submitPeerReviewLabel: "Evaluation abgeben",
    hidePeerReviewLabel: "Ausblenden",
    essayQuestionAnswerTextBoxLabel: "Evaluation erstellen",
    optionLabel: "Alternative",
    answerRejected: "Deine Antwort wurde abgelehnt",
    answerFlaggedAsSpam: "Deine Antwort wurde als Spam gemeldet",
    answerConfirmed: "Du hast die Übung bestanden!",
    manualReview:
      "Deine Antwort wartet auf die Evaluierung durch das Kurspersonal",
  },
  receivedPeerReviews: {
    errorLabel:
      "Es ist ein Fehler beim Anzeigen der erhaltenen Peer-Evaluationen aufgetreten. Versuche bitte, die Seite neu zu laden.",
    noSupportForQuestionTypeLabel:
      "Dieser Fragetyp wird bei der Peer-Evaluation nicht unterstützt",
    loadingLabel: "Die erhaltenen Peer-Evaluationen werden geladen...",
    noPeerReviewsReceivedlabel:
      "Deine Antwort hat noch keine Peer-Evaluationen erhalten",
    numberOfPeerReviewsText: n =>
      `Deine Antwort hat ${n} Peer-Evaluation${n > 0 && "en"} erhalten`,
    toggleButtonExpandLabel: "Alle erhaltenen Peer-Evaluationen anzeigen",
    toggleButtonShrinkLabel: "Peer-Evaluationen ausblenden",
    averageOfGradesLabel:
      "Der Durchschnitt aller erhaltenen Evaluationen beträgt",
    detailedViewLabel: "Alle Evaluationen, die deine Antwort erhalten hat",
    summaryViewLabel: "Erhaltene Peer-Evaluationen:",
    peerReviewLabel: "Peer-Evaluation",
    peerReviewReceived: "Olet saanut uuden vertaisarvion",
    peerReviewReceivedFor: (title: string) =>
      `Olet saanut uuden vertaisarvion tehtävässä ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Der Fragetyp '${itemType}' wird nicht unterstützt.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Die richtige Antwort auswählen",
    chooseAllSuitableOptionsLabel: "Alle passenden Alternativen wählen.",
    answerCorrectLabel: "Richtig",
    answerIncorrectLabel: "Falsch",
  },
  stage: {
    answerStageLabel: "Beantworten der Übung",
    givingPeerReviewsStageLabel: "Abgabe von Peer-Evaluationen",
    receivingPeerReviewsStageLabel: "Empfang von Peer-Evaluationen",
    evaluationStageLabel: "Bewertung der Übung",
  },
  general: {
    pastDeadline: "Du kannst diese Übung nicht mehr beantworten",
    answerMissingBecauseQuizModifiedLabel:
      "Frage nicht beantwortet. Das Quiz wurde wahrscheinlich nach deiner Beantwortung überarbeitet.",
    submitButtonLabel: "Senden",
    errorLabel: "Fehler",
    loginToViewPromptLabel: "Melde dich an, um dir die Übung anzusehen",
    loginToAnswerPromptLabel: "Melde dich an, um die Übung zu beantworten",
    loadingLabel: "Wird geladen",
    answerCorrectLabel: "Die Antwort ist richtig",
    alreadyAnsweredLabel: "Schon beantwortet",
    answerIncorrectLabel: "Die Antwort ist nicht richtig",
    kOutOfNCorrect: (k, n) => `${k}/${n} richtige Antworten`,
    pointsAvailableLabel: "Maximale Punktezahl der Übung",
    pointsReceivedLabel: "Erhaltene Punkte",
    incorrectSubmitWhileTriesLeftLabel:
      "Die Antwort war nicht ganz richtig. Bitte versuch es noch einmal!",
    triesRemainingLabel: "Versuche übrig",
    quizLabel: "Quiz",
    pointsLabel: "Punkte",
    triesNotLimitedLabel: "Die Anzahl der Versuche ist nicht begrenzt",
    submitGeneralFeedbackLabel: "Gesendet",
    submitButtonAlreadyAnsweredLabel: "Beantwortet",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Punkte werden nur für komplett richtige Antworten vergeben"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Beantwortet",
    unanswered: "Nicht beantwortet",
    rejected: "Antwort abgelehnt, bitte erneut versuchen",
    progressUpdated: "Kurssipisteesi ovat päivittyneet",
    answerConfirmed: "Vastauksesi on hyväksytty",
    answerConfirmedFor: (title: string) =>
      `Vastauksesi tehtävään ${title} on hyväksytty`,
    courseCompleted: "Olet päässyt läpi kurssista!",
  },
  error: {
    submitFailedError:
      "Deine Antwort konnte nicht gesendet werden. Bitte versuch es später noch einmal.",
    quizLoadFailedError: "Die Übung konnte nicht geladen werden.",
    progressFetchError:
      "Suoritustietojen lataaminen ei onnistunut. Kokeile myöhemmin uudestaan",
    submitSpamFlagError:
      "Asiattomasta vastauksesta ilmoittaminen ei onnistunut",
    fetchReviewCandidatesError:
      "Vastausten lataaminen vertaisarviota varten ei onnistunut. Kokeile myöhemmin uudestaan.",
  },
}

export default finnishLabels
