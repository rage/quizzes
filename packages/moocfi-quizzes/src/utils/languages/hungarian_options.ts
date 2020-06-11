import { SingleLanguageLabels } from "./index"

const hungarianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Példaválasz",
    userAnswerLabel: "A válaszod",
    currentNumberOfWordsLabel: "Szavak száma",
    textFieldLabel: "A válaszod",
    conformToLimitsToSubmitLabel:
      "Ahhoz, hogy el tudd küldeni a választ, győződj meg róla, hogy nem lépted túl a szókorlátot",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `A válasz legfeljebb ${max} szót tartalmazhat`
      }

      if (!max) {
        return `A válasznak legalább ${min} szót kell tartalmaznia`
      }
      return `A válasznak legalább ${min} szót kell tartalmaznia, de nem lehet hosszabb ${max} szónál`
    },
  },
  open: {
    placeholder: "Válasz",
    userAnswerLabel: "A válaszod",
    feedbackForSuccess: "A válasz helyes",
    feedbackForFailure: "A válasz helytelen",
  },
  peerReviews: {
    loadingLabel: "Betöltés",
    chooseButtonLabel: "Kiválasztás",
    unselectButtonLabel: "Kiválasztás törlése",
    chooseEssayInstruction: "Válaszd ki az egyik opciót értékelésre",
    chosenEssayInstruction: "Ellenőrizd a kiválasztott választ",
    givenPeerReviewsLabel: "Társértékelés készítése",
    noPeerAnswersAvailableLabel:
      "Társértékeléshez nem áll rendelkezésre válasz",
    reportAsInappropriateLabel: "Spam jelentése",
    submitPeerReviewLabel: "Értékelés küldése",
    peerReviewsCompletedInfo: "Elegendő társértékelést készítettél",
    giveExtraPeerReviews:
      "Elkészítetted a szükséges számú társértékelést. Ha több társértékelést készítesz, válaszod gyorsabban értékeljük!",
    giveExtraPeerReviewsQuizConfirmed:
      "További társértékeléseket is készíthetsz, hogy segíts másoknak",
    displayPeerReview: "Készítsen partneri értékelést",
    hidePeerReviewLabel: "Elrejtés",
    essayQuestionAnswerTextBoxLabel: "Értékelés írása",
    optionLabel: "Opció",
    answerRejected: "Válaszod elutasították",
    answerFlaggedAsSpam: "Válaszod spamként jelentették",
    answerConfirmed: "Válaszod elfogadták",
    manualReview: "Válaszod a tanfolyam munkatársai ellenőrzik",
    peerReviewGroupTitle: "Szakértői vélemény kérdései",
    peerReviewLikertDetails:
      "Az egyes állításokat értékelje 1-5 skálán. 1 azt jelenti, hogy nem ért egyet, 5 azt jelenti, hogy határozottan egyetért.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "A kapott értékelések osztályzatainak átlaga:",
    detailedViewLabel: "A válaszodra kapott összes értékelés",
    errorLabel:
      "Hiba történt a beérkezett társértékelések megjelenítésekor. Kérjük, próbáld meg újra betölteni az oldalt.",
    loadingLabel: "A kapott társértékelések betöltése...",
    noPeerReviewsReceivedlabel: "Válaszod még egy társ sem értékelte",
    noSupportForQuestionTypeLabel:
      "Ez a fajta társértékelési kérdés nem támogatott	",
    numberOfPeerReviewsText: n =>
      `Válaszod ${n} számú társ értékelte.`,
    summaryViewLabel: "A kapott társértékelések:",
    toggleButtonExpandLabel: "Az összes társértékelés megjelenítése",
    toggleButtonShrinkLabel: "A társértékelések elrejtése",
    peerReviewLabel: "Társértékelés",
    peerReviewReceived: "Új társértékelés érkezett",
    peerReviewReceivedFor: (title: string) =>
      `Az ${title} feladat esetében új társértékelés érkezett`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Az '${itemType}' típusú kérdés nem támogatott.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Válaszd ki a helyes választ",
    chooseAllSuitableOptionsLabel:
      "Kérjük, jelöld be az összes megfelelő választ",
    answerCorrectLabel: "Helyes",
    answerIncorrectLabel: "Helytelen",
  },
  stage: {
    answerStageLabel: "A feladat megválaszolása",
    givingPeerReviewsStageLabel: "Társértékelések készítése",
    receivingPeerReviewsStageLabel: "Társértékelések fogadása",
    evaluationStageLabel: "Osztályzatra vár",
  },
  general: {
    pastDeadline: "Erre a feladatra már nem áll módodban válaszolni",
    answerMissingBecauseQuizModifiedLabel:
      "A kérdésre nem érkezett válasz. A tesztet a válasz elküldését követően valószínűleg módosították.",
    submitButtonLabel: "Küldés",
    errorLabel: "Hiba",
    loginToViewPromptLabel: "Jelentkezz be a feladat megtekintéséhez",
    loginToAnswerPromptLabel: "Jelentkezz be a feladat megválaszolásához",
    loadingLabel: "Betöltés",
    answerCorrectLabel: "A válasz helyes",
    alreadyAnsweredLabel: "Már válaszoltál erre a kérdésre",
    answerIncorrectLabel: "A válasz helytelen",
    kOutOfNCorrect: (k, n) => `${k}/${n} válasz helyes`,
    pointsAvailableLabel: "A feladatra kapott pontok",
    pointsReceivedLabel: "Elért pontszám",
    incorrectSubmitWhileTriesLeftLabel:
      "A válasz nem volt teljesen helyes. Kérjük, próbáld meg újra!",
    triesRemainingLabel: "Fennmaradó próbálkozások",
    quizLabel: "Tesztkérdések",
    pointsLabel: "Pontszám",
    triesNotLimitedLabel: "A próbálkozások száma korlátlan",
    submitGeneralFeedbackLabel: "Beküldve",
    submitButtonAlreadyAnsweredLabel: "Megválaszolva",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Csak teljesen helyes válasz esetén kapsz pontot."
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Megválaszolva",
    unanswered: "meg nem válaszolt",
    rejected: "Elutasított válasz, próbálkozzon újra",
    progressUpdated: "A tanfolyam során elért eredmények frissültek",
    answerConfirmed: "Válaszod megerősítették!",
    answerConfirmedFor: (title: string) =>
      `Az ${title} feladatra adott válaszod megerősítették!`,
    courseCompleted: "Elvégezted a tanfolyamot!",
  },
  error: {
    submitFailedError: "A válasz nem küldhető el. Kérjük, próbáld meg később.",
    quizLoadFailedError: "Nem tölthető be a feladat.",
    progressFetchError:
      "Nem sikerült beolvasni a tanfolyam során elért eredményeket. Kérjük, próbáld meg később.",
    submitSpamFlagError: "Nem sikerült a spam jelentése",
    fetchReviewCandidatesError:
      "Probléma merül fel a válaszok társértékelés céljából való visszakeresése során. Kérjük, próbáld meg később.",
  },
}

export default hungarianLabels
