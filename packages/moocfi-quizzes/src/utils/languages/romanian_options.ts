import { SingleLanguageLabels } from "./index"

const romanianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Exemplu de răspuns",
    userAnswerLabel: "Răspunsul dumneavoastră",
    currentNumberOfWordsLabel: "Cuvinte",
    textFieldLabel: "Răspunsul dumneavoastră",
    conformToLimitsToSubmitLabel:
      "Pentru a putea trimite răspunsul, asigurați-vă că acesta respectă limitele privind numărul de cuvinte",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Răspunsul dumneavoastră nu ar trebui să depășească ${max} cuvinte`
      }

      if (!max) {
        return `Răspunsul dumneavoastră ar trebui să cuprindă cel puțin ${min} cuvinte`
      }

      return `Răspunsul dumneavoastră ar trebui să cuprindă între ${min}-${max} cuvinte`
    },
  },
  open: {
    placeholder: "Răspuns",
    userAnswerLabel: "Răspunsul dumneavoastră",
    feedbackForFailure: "Nu ați răspuns corect",
    feedbackForSuccess: "Ați răspuns corect",
  },
  peerReviews: {
    loadingLabel: "Se încarcă",
    noPeerAnswersAvailableLabel: "Vertaisarvioitavia vastauksia ei saatavilla",
    chooseButtonLabel: "Valitse",
    unselectButtonLabel: "Peru valinta",
    chooseEssayInstruction: "Alegeți o opțiune pentru evaluare:",
    chosenEssayInstruction: "Evaluați răspunsul pe care l-ați selectat:",
    displayPeerReview: "Lăsați o evaluare inter pares",
    giveExtraPeerReviews:
      "Ați lăsat numărul necesar de evaluări inter pares. Dacă lăsați mai multe evaluări colegiale, răspunsul dumneavoastră va fi evaluat mai rapid!",
    giveExtraPeerReviewsQuizConfirmed:
      "Puteți lăsa și alte evaluări colegiale pentru a ajuta alte persoane",
    givenPeerReviewsLabel: "Evaluări lăsate",
    peerReviewsCompletedInfo: "Ați lăsat suficiente evaluări colegiale",
    reportAsInappropriateLabel: "Raportați ca spam",
    submitPeerReviewLabel: "Trimiteți evaluarea",
    hidePeerReviewLabel: "Ascundeți",
    essayQuestionAnswerTextBoxLabel: "Scrieți o evaluare",
    optionLabel: "Opțiune",
    answerRejected: "Răspunsul dumneavoastră a fost respins",
    answerFlaggedAsSpam: "Răspunsul dumneavoastră a fost raportat ca spam",
    answerConfirmed: "Răspunsul dumneavoastră a fost acceptat!",
    manualReview:
      "Răspunsul dumneavoastră este evaluat de către personalul cursului",
    peerReviewGroupTitle: "Întrebări de evaluare de la egal la egal",
    peerReviewLikertDetails:
      "Evaluează fiecare afirmație pe o scară de la 1-5. 1 înseamnă puternic dezacord, 5 înseamnă puternic de acord.",
  },
  receivedPeerReviews: {
    errorLabel:
      "A apărut o eroare la afișarea evaluărilor colegiale primite. Vă rugăm încercați să reîncărcați pagina.",
    noSupportForQuestionTypeLabel:
      "Acest tip de întrebare pentru evaluarea colegială nu este posibil",
    loadingLabel: "Se încarcă evaluările colegiale primite...",
    noPeerReviewsReceivedlabel:
      "Răspunsul dumneavoastră nu a primit încă nicio evaluare colegială",
    numberOfPeerReviewsText: n =>
      `Răspunsul dumneavoastră a primit ${n} evaluări colegiale/evaluări arvio.`,
    toggleButtonExpandLabel: "Arătați toate evaluările colegiale primite",
    toggleButtonShrinkLabel: "Ascundeți evaluările colegiale",
    averageOfGradesLabel: "Nota medie a evaluărilor primite este",
    detailedViewLabel:
      "Toate evaluările pe care le-a primit răspunsul dumneavoastră",
    summaryViewLabel: "Evaluări colegiale primite:",
    peerReviewLabel: "Evaluare colegială",
    peerReviewReceived: "Ați primit o nouă evaluare colegială",
    peerReviewReceivedFor: (title: string) =>
      `Ați primit o nouă evaluare colegială la exercițiul ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Întrebarea de tip '${itemType}' nu este posibilă.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Selectați răspunsul corect",
    chooseAllSuitableOptionsLabel: "Selectați toate variantele aplicabile.",
    answerCorrectLabel: "Corect",
    answerIncorrectLabel: "Inorect",
    selectOption: "select an option",
  },
  stage: {
    answerStageLabel: "Se transmit răspunsurile la exercițiu",
    givingPeerReviewsStageLabel: "Se lasă evaluări colegiale",
    receivingPeerReviewsStageLabel: "Se primesc evaluări colegiale",
    evaluationStageLabel: "Se așteaptă notarea",
  },
  general: {
    pastDeadline: "Nu mai puteți răspunde la acest exercițiu",
    answerMissingBecauseQuizModifiedLabel:
      "Nu s-a răspuns la întrebare. Chestionarul a fost probabil modificat după ce ați răspuns.",
    submitButtonLabel: "Trimiteți",
    errorLabel: "Eroare",
    loginToViewPromptLabel: "Conectați-vă pentru a vizualiza exercițiul",
    loginToAnswerPromptLabel: "Conectați-vă pentru a răspunde la exercițiu",
    loadingLabel: "Se încarcă",
    answerCorrectLabel: "Ați răspuns corect",
    alreadyAnsweredLabel: "Ați răspuns deja",
    answerIncorrectLabel: "Nu ați răspuns corect",
    kOutOfNCorrect: (k, n) => `${k}/${n} răspunsuri corecte`,
    pointsAvailableLabel: "Puncte disponibile pentru exercițiu",
    pointsReceivedLabel: "Puncte primite",
    incorrectSubmitWhileTriesLeftLabel:
      "Răspunsul nu a fost întru totul corect. Vă rugăm să încercați din nou!",
    triesRemainingLabel: "Numărul de încercări rămase",
    quizLabel: "Chestionar",
    pointsLabel: "Puncte",
    triesNotLimitedLabel: "Numărul de încercări nu este limitat",
    submitGeneralFeedbackLabel: "Trimise",
    submitButtonAlreadyAnsweredLabel: "Răspunsuri trimise",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Pentru a primi puncte, răspunsul trebuie să fie întru totul corect"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Răspunsuri trimise",
    unanswered: "Fără răspuns",
    rejected: "Răspunsul dumneavoastră a fost respins",
    progressUpdated:
      "Datele despre modul în care avansează cursul au fost actualizate",
    answerConfirmed: "Răspunsul dumneavoastră a fost confirmat!",
    answerConfirmedFor: (title: string) =>
      `Răspunsul dumneavoastră la exercițiul ${title} a fost confirmat!`,
    courseCompleted: "Ați terminat cursul!",
  },
  error: {
    submitFailedError:
      "Răspunsul dumneavoastră nu a putut fi trimis. Vă rugăm să încercați mai târziu.",
    quizLoadFailedError: "Exercițiul nu a putut fi încărcat",
    progressFetchError:
      "Nu au putut fi recuperate datele despre modul în care avansează cursul. Vă rugăm să încercați mai târziu.",
    submitSpamFlagError: "Nu a putut fi raportat ca spam",
    fetchReviewCandidatesError:
      "A apărut o eroare în momentul recuperării răspunsurilor pentru evaluarea colegială. Vă rugăm să încercați mai târziu.",
  },
}

export default romanianLabels
