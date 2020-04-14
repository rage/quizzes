import { SingleLanguageLabels } from "./index"

const italianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Esempio di risposta",
    userAnswerLabel: "La tua risposta",
    currentNumberOfWordsLabel: "Parole",
    textFieldLabel: "La tua risposta",
    conformToLimitsToSubmitLabel:
      "Per poter essere inviata, la risposta non deve superare il limite di parole consentite",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `La tua risposta non deve superare le ${max} parole`
      }

      if (!max) {
        return `La tua risposta deve contenere almeno ${min} parole`
      }

      return `La tua risposta deve essere compresa tra le ${min}-${max} parole`
    },
  },
  open: {
    placeholder: "Risposta",
    userAnswerLabel: "La tua risposta",
    feedbackForFailure: "La tua risposta è sbagliata",
    feedbackForSuccess: "La tua risposta è esatta",
  },
  peerReviews: {
    loadingLabel: "Caricamento...",
    noPeerAnswersAvailableLabel:
      "Non sono disponibili risposte per la valutazione tra pari",
    chooseButtonLabel: "Seleziona",
    unselectButtonLabel: "Annulla selezione",
    chooseEssayInstruction: "Scegli un'opzione da valutare",
    chosenEssayInstruction: "Valuta la risposta selezionata",
    displayPeerReview: "Effettua una valutazione tra pari",
    giveExtraPeerReviews:
      "Hai effettuato il numero richiesto di valutazioni tra pari. Se effettui più valutazioni tra pari, la tua risposta sarà valutata più velocemente!",
    giveExtraPeerReviewsQuizConfirmed:
      "Puoi continuare a effettuare valutazioni tra pari per aiutare gli altri",
    givenPeerReviewsLabel: "Valutazioni tra pari effettuate",
    peerReviewsCompletedInfo:
      "Hai effettuato un numero sufficiente di valutazioni tra pari",
    reportAsInappropriateLabel: "Segnala come spam",
    submitPeerReviewLabel: "Invia la valutazione",
    hidePeerReviewLabel: "Nascondi",
    essayQuestionAnswerTextBoxLabel: "Scrivi una valutazione",
    optionLabel: "Opzione",
    answerRejected: "La tua risposta è stata respinta",
    answerFlaggedAsSpam: "La tua risposta è stata segnalata come spam",
    answerConfirmed: "La tua risposta è stata accettata!",
    manualReview:
      "La tua risposta è in corso di valutazione da parte del personale del corso",
    peerReviewGroupTitle: "Vertaisarviointikysymykset",
    peerReviewLikertDetails:
      "Arvioi jokainen väite asteikolla 1-5. 1 on vahvasti eri mieltä ja 5 on vahvasti samaa mieltä.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Si è verificato un errore nella visualizzazione delle valutazioni tra pari ricevute. Prova a ricaricare la pagina.",
    noSupportForQuestionTypeLabel:
      "Questo tipo di risposta non è supportato per la valutazione tra pari",
    loadingLabel: "Caricamento delle valutazioni tra pari ricevute...",
    noPeerReviewsReceivedlabel:
      "La tua risposta non ha ancora ricevuto valutazioni tra pari",
    numberOfPeerReviewsText: (n) =>
      `&#39La tua risposta ha ricevuto ${n} valutazione / i tra pari.`,
    toggleButtonExpandLabel: "Mostrare tutte le valutazioni tra pari ricevute",
    toggleButtonShrinkLabel: "Nascondere le valutazioni tra pari",
    averageOfGradesLabel: "Il voto medio delle valutazioni ricevute è",
    detailedViewLabel: "Tutte le valutazioni ricevute dalla tua risposta",
    summaryViewLabel: "Valutazioni tra pari ricevute:",
    peerReviewLabel: "Valutazione tra pari",
    peerReviewReceived: "Hai ricevuto una nuova valutazione tra pari",
    peerReviewReceivedFor: (title: string) =>
      `Hai ricevuto una nuova valutazione tra pari per l'esercizio ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Le risposte di tipo '${itemType}' non sono supportate.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Seleziona la risposta esatta",
    chooseAllSuitableOptionsLabel: "Più risposte possibili",
    answerCorrectLabel: "Esatto",
    answerIncorrectLabel: "Sbagliato",
  },
  stage: {
    answerStageLabel: "Tehtävään vastaaminen",
    givingPeerReviewsStageLabel: "Vertaisarvioiden antaminen",
    receivingPeerReviewsStageLabel: "Vertaisarvioiden vastaanottaminen",
    evaluationStageLabel: "Odottaa arvostelua",
  },
  general: {
    pastDeadline: "Non è più possibile fare questo esercizio",
    answerMissingBecauseQuizModifiedLabel:
      "A questa domanda non è stata data una risposta. Il quiz probabilmente è stato modificato dopo la tua risposta.",
    submitButtonLabel: "Invia",
    errorLabel: "Errore",
    loginToViewPromptLabel: "Effettua l'accesso per vedere l'esercizio",
    loginToAnswerPromptLabel: "Effettua l'accesso per fare l'esercizio",
    loadingLabel: "Caricamento...",
    answerCorrectLabel: "La risposta è esatta",
    alreadyAnsweredLabel: "Hai già fornito una risposta",
    answerIncorrectLabel: "La risposta è sbagliata",
    kOutOfNCorrect: (k, n) => `${k}/${n} risposte esatte`,
    pointsAvailableLabel: "Punti disponibili per l'esercizio",
    pointsReceivedLabel: "Punti ottenuti",
    incorrectSubmitWhileTriesLeftLabel:
      "La risposta non era del tutto esatta Riprova!",
    triesRemainingLabel: "Tentativi restanti",
    quizLabel: "Quiz",
    pointsLabel: "Punti",
    triesNotLimitedLabel: "Il numero di tentativi è illimitato",
    submitGeneralFeedbackLabel: "Invio effettuato",
    submitButtonAlreadyAnsweredLabel: "Risposta data",
    pointsGrantingPolicyInformer: (policy) => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Per ottenere punti, la risposta deve essere completamente esatta"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Risposta data",
    unanswered: "Risposta non data",
    rejected: "Risposta rifiutata, si prega di riprovare",
    progressUpdated: "Avanzamento del corso aggiornato",
    answerConfirmed: "La tua risposta è stata confermata!",
    answerConfirmedFor: (title: string) =>
      `La tua risposta all'esercizio ${title} è stata confermata!`,
    courseCompleted: "Hai completato il corso!",
  },
  error: {
    submitFailedError: "Impossibile inviare la risposta. Riprova in seguito.",
    quizLoadFailedError: "Tehtävän lataaminen ei onnistunut",
    progressFetchError:
      "Impossibile recuperare i dati relativi all'avanzamento del corso. Riprova in seguito.",
    submitSpamFlagError: "Impossibile segnalare lo spam",
    fetchReviewCandidatesError:
      "Si è verificato un errore durante il recupero delle risposte per la valutazione tra pari. Riprova in seguito.",
  },
}

export default italianLabels
