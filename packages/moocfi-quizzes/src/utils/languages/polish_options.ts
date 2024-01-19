import { SingleLanguageLabels } from "./index"

const polishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Przykładowa odpowiedź",
    userAnswerLabel: "Podaj odpowiedź",
    currentNumberOfWordsLabel: "Liczba słów",
    textFieldLabel: "Twoja odpowiedź",
    conformToLimitsToSubmitLabel:
      "Odpowiedź zostanie wysłana, jeśli zawiera wymaganą liczbę słów",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Odpowiedź nie powinna liczyć więcej niż ${max} słów`
      }

      if (!max) {
        return `Odpowiedź powinna liczyć co najmniej ${min} słów`
      }
      return `Odpowiedź powinna liczyć od ${min} do ${max} słów`
    },
  },
  open: {
    placeholder: "Odpowiedź",
    userAnswerLabel: "Twoja odpowiedź",
    feedbackForSuccess: "Odpowiedź jest prawidłowa",
    feedbackForFailure: "Odpowiedź nie jest prawidłowa",
    yourAnswerIsNotFormattedCorrectly:
      "Twoja odpowiedź nie jest poprawnie sformatowana",
  },
  peerReviews: {
    loadingLabel: "Pobieranie danych",
    chooseButtonLabel: "Wybierz",
    unselectButtonLabel: "Anuluj wybór",
    chooseEssayInstruction: "Wybierz jeden wariant do oceny",
    chosenEssayInstruction: "Oceń wybraną odpowiedź",
    givenPeerReviewsLabel: "Przeprowadzone oceny",
    noPeerAnswersAvailableLabel: "Brak dostępnych odpowiedzi do oceny",
    reportAsInappropriateLabel: "Zgłoś jako spam",
    submitPeerReviewLabel: "Wyślij ocenę",
    peerReviewsCompletedInfo: "Przeprowadzono wystarczającą liczbę ocen",
    giveExtraPeerReviews:
      "Przeprowadzono wymaganą liczbę ocen. Jeśli przeprowadzisz więcej ocen, Twoja odpowiedź zostanie szybciej poddana ocenie!",
    giveExtraPeerReviewsQuizConfirmed:
      "Możesz nadal przeprowadzać oceny, aby wesprzeć innych",
    displayPeerReview: "Przeprowadź ocenę",
    hidePeerReviewLabel: "Ukryj",
    essayQuestionAnswerTextBoxLabel: "Napisz ocenę",
    optionLabel: "Wariant",
    answerRejected: "Odpowiedź została odrzucona",
    answerFlaggedAsSpam: "Odpowiedź została zgłoszona jako spam",
    answerConfirmed: "Odpowiedź została przyjęta!",
    manualReview: "Odpowiedź jest poddawana ocenie przez obsługę kursu",
    peerReviewGroupTitle: "Peer review questions",
    peerReviewLikertDetails:
      "Evaluate each statement on a scale of 1-5. 1 means strongly disagree, 5 means strongly agree.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "Średnia ocena z otrzymanych ocen to",
    detailedViewLabel: "Wszystkie oceny, jakie otrzymała Twoja odpowiedź",
    errorLabel:
      "Podczas wyświetlania otrzymanych ocen wystąpił błąd. Spróbuj ponownie załadować stronę.",
    loadingLabel: "Ładowanie otrzymanych ocen...",
    noPeerReviewsReceivedlabel: "Odpowiedź nie została jeszcze poddana ocenie",
    noSupportForQuestionTypeLabel: "Odpowiedź na to pytanie nie podlega ocenie",
    numberOfPeerReviewsText: n => `Odpowiedź otrzymała ${n} ocen`,
    summaryViewLabel: "Otrzymane oceny:",
    toggleButtonExpandLabel: "Pokaż wszystkie otrzymane oceny...",
    toggleButtonShrinkLabel: "Ukryj",
    peerReviewLabel: "Ocena",
    peerReviewReceived: "Nadesłano nową ocenę",
    peerReviewReceivedFor: (title: string) =>
      `Nadesłano nową ocenę ćwiczenia ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Pytanie typu '${itemType}' jest niedostępne.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Wybierz prawidłową odpowiedź",
    chooseAllSuitableOptionsLabel: "Zaznacz wszystkie pasujące odpowiedzi",
    answerCorrectLabel: "Odpowiedź prawidłowa",
    answerIncorrectLabel: "Odpowiedź nieprawidłowa",
    selectOption: "select an option",
  },
  stage: {
    answerStageLabel: "Rozwiązywanie ćwiczenia",
    givingPeerReviewsStageLabel: "Przeprowadzanie ocen",
    receivingPeerReviewsStageLabel: "Otrzymywanie ocen",
    evaluationStageLabel: "Oczekiwanie na ocenę",
  },
  general: {
    pastDeadline: "Nie można już udzielać odpowiedzi na to ćwiczenie",
    answerMissingBecauseQuizModifiedLabel:
      "Nie udzielono odpowiedzi na to pytanie. Zadanie prawdopodobnie zostało zmienione po udzieleniu odpowiedzi.",
    submitButtonLabel: "Prześlij",
    errorLabel: "Błąd",
    loginToViewPromptLabel: "Zaloguj się, aby zobaczyć ćwiczenie",
    loginToAnswerPromptLabel: "Zaloguj się, aby rozwiązać ćwiczenie",
    loadingLabel: "Pobieranie danych",
    answerCorrectLabel: "Odpowiedź jest prawidłowa",
    alreadyAnsweredLabel: "To zadanie jest już rozwiązane",
    answerIncorrectLabel: "Odpowiedź jest nieprawidłowa",
    kOutOfNCorrect: (k, n) => `${k}/${n} odpowiedzi poprawnych`,
    pointsAvailableLabel: "Liczba punktów za to ćwiczenie",
    pointsReceivedLabel: "Otrzymane punkty ",
    incorrectSubmitWhileTriesLeftLabel:
      "Odpowiedź nie była w pełni prawidłowa. Spróbuj ponownie.",
    triesRemainingLabel: "Liczba pozostałych prób",
    quizLabel: "Pytanie",
    pointsLabel: "Punkty",
    triesNotLimitedLabel: "Liczba prób jest nieograniczona",
    submitGeneralFeedbackLabel: "Wysłano",
    submitButtonAlreadyAnsweredLabel: "Rozwiązano",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Punkty zostaną przyznane po udzieleniu w pełni prawidłowej odpowiedzi"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Rozwiązano",
    unanswered: "Bez odpowiedzi",
    rejected: "Rejected answer, try again",
    progressUpdated: "Zaktualizowano informację o postępach",
    answerConfirmed: "Rozwiązanie zostało zatwierdzone!",
    answerConfirmedFor: (title: string) =>
      `Rozwiązanie ćwiczenia ${title} zostało zatwierdzone!`,
    courseCompleted: "Kurs został ukończony!",
  },
  error: {
    submitFailedError:
      "Nie można przesłać rozwiązania. Spróbuj ponownie później.",
    quizLoadFailedError: "Załadowanie ćwiczenia było niemożliwe",
    progressFetchError:
      "Ściągnięcie informacji o postępach było niemożliwe. Spróbuj ponownie później.",
    submitSpamFlagError: "Zgłoszenie spamu było niemożliwe",
    fetchReviewCandidatesError:
      "Wystąpił błąd przy pobieraniu rozwiązań do oceny. Spróbuj ponownie później.",
  },
}

export default polishLabels
