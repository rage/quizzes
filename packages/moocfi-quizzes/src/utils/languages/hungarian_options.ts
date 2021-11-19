import { SingleLanguageLabels } from "./index"

const hungarianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Példaválasz",
    userAnswerLabel: "Az Ön válasza",
    currentNumberOfWordsLabel: "Szavak száma",
    textFieldLabel: "Az Ön válasza",
    conformToLimitsToSubmitLabel:
      "Ahhoz, hogy el tudja küldeni válaszát, győződjön meg arról, hogy nem lépte túl a szókorlátot",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Válasza legfeljebb ${max} szót tartalmazhat`
      }

      if (!max) {
        return `Válaszának legalább ${min} szót kell tartalmaznia`
      }
      return `Válaszának legalább ${min} szót kell tartalmaznia, de nem lehet hosszabb ${max} szónál`
    },
  },
  open: {
    placeholder: "Válasz",
    userAnswerLabel: "Az Ön válasza",
    feedbackForSuccess: "Válasza helyes",
    feedbackForFailure: "Válasza helytelen",
  },
  peerReviews: {
    loadingLabel: "Betöltés",
    chooseButtonLabel: "Kiválasztás",
    unselectButtonLabel: "Kiválasztás törlése",
    chooseEssayInstruction: "Válassza ki az egyik opciót értékelésre",
    chosenEssayInstruction: "Ellenőrizze a kiválasztott választ",
    givenPeerReviewsLabel: "Partneri értékelés készítése",
    noPeerAnswersAvailableLabel:
      "Partneri értékeléshez nem áll rendelkezésre válasz",
    reportAsInappropriateLabel: "Spam jelentése",
    submitPeerReviewLabel: "Értékelés küldése",
    peerReviewsCompletedInfo: "Elegendő partneri értékelést készített",
    giveExtraPeerReviews:
      "Elkészítette a szükséges számú partneri értékelést. Ha több partneri értékelést készít, válaszát gyorsabban értékeljük!",
    giveExtraPeerReviewsQuizConfirmed:
      "További partneri értékeléseket is készíthet, hogy segítsen másoknak",
    displayPeerReview: "Készítsen partneri értékelést",
    hidePeerReviewLabel: "Elrejtés",
    essayQuestionAnswerTextBoxLabel: "Értékelés írása",
    optionLabel: "Opció",
    answerRejected: "Válaszát elutasították",
    answerFlaggedAsSpam: "Válaszát spamként jelentették",
    answerConfirmed: "Válaszát elfogadták!",
    manualReview: "Válaszát a tanfolyam munkatársai ellenőrzik",
    peerReviewGroupTitle: "Szakértői vélemény kérdései",
    peerReviewLikertDetails:
      "Az egyes állításokat értékelje 1-5 skálán. 1 azt jelenti, hogy nem ért egyet, 5 azt jelenti, hogy határozottan egyetért.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "A kapott értékelések osztályzatainak átlaga:",
    detailedViewLabel: "A válaszára kapott összes értékelés",
    errorLabel:
      "Hiba történt a beérkezett partneri értékelések megjelenítésekor. Kérjük, próbálja újra betölteni az oldalt.",
    loadingLabel: "A kapott partneri értékelések betöltése...",
    noPeerReviewsReceivedlabel: "Válaszát még egy partner sem értékelte",
    noSupportForQuestionTypeLabel:
      "Ez a fajta partneri értékelési kérdés nem támogatott",
    numberOfPeerReviewsText: n =>
      `Válaszát ${n} számú partner értékelte${n > 1 ? "s" : ""}.`,
    summaryViewLabel: "A kapott partneri értékelések:",
    toggleButtonExpandLabel: "Az összes partneri értékelések megjelenítése",
    toggleButtonShrinkLabel: "A partneri értékelések elrejtése",
    peerReviewLabel: "Partneri értékelés",
    peerReviewReceived: "Új partneri értékelés érkezett",
    peerReviewReceivedFor: (title: string) =>
      `Az ${title} feladat esetében új partneri értékelés érkezett.`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Az '${itemType}' típusú kérdés nem támogatott.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Válassza ki a helyes választ",
    chooseAllSuitableOptionsLabel:
      "Kérjük, jelölje be az összes megfelelő választ",
    answerCorrectLabel: "Helyes",
    answerIncorrectLabel: "Helytelen",
    selectOption: "select an option",
  },
  stage: {
    answerStageLabel: "A feladat megválaszolása",
    givingPeerReviewsStageLabel: "Partneri értékelése készítése",
    receivingPeerReviewsStageLabel: "Partneri értékelések fogadása",
    evaluationStageLabel: "Osztályzatra vár",
  },
  general: {
    pastDeadline: "Erre a feladatra már nem áll módjában válaszolni",
    answerMissingBecauseQuizModifiedLabel:
      "A kérdésre nem érkezett válasz. A tesztet a válaszát követően valószínűleg módosították.",
    submitButtonLabel: "Küldés",
    errorLabel: "Hiba",
    loginToViewPromptLabel: "Jelentkezzen be a feladat megtekintéséhez",
    loginToAnswerPromptLabel: "Jelentkezzen be a feladat megválaszolásához",
    loadingLabel: "Betöltés",
    answerCorrectLabel: "A válasz helyes",
    alreadyAnsweredLabel: "Már válaszolt erre a kérdésre",
    answerIncorrectLabel: "A válasz helytelen",
    kOutOfNCorrect: (k, n) => `${k}/${n} válasz helyes`,
    pointsAvailableLabel: "A feladatra kapott pontok",
    pointsReceivedLabel: "Elért pontszám",
    incorrectSubmitWhileTriesLeftLabel:
      "A válasz nem volt teljesen helyes. Kérjük, próbálja meg újra!",
    triesRemainingLabel: "Fennmaradó próbálkozások",
    quizLabel: "Tesztkérdések",
    pointsLabel: "Pontszám",
    triesNotLimitedLabel: "A próbálkozások száma korlátlan",
    submitGeneralFeedbackLabel: "Beküldve",
    submitButtonAlreadyAnsweredLabel: "Megválaszolva",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Csak teljesen helyes válasz esetén kap pontot."
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Megválaszolva",
    unanswered: "Meg nem válaszolt",
    rejected: "Elutasított válasz, próbálkozzon újra",
    progressUpdated: "A tanfolyam során elért eredmények frissültek",
    answerConfirmed: "Válaszát megerősítették!",
    answerConfirmedFor: (title: string) =>
      `Az ${title} feladatra adott válaszát megerősítették!`,
    courseCompleted: "Elvégezte a tanfolyamot!",
  },
  error: {
    submitFailedError: "Válasza nem küldhető el. Kérjük, próbálja meg később.",
    quizLoadFailedError: "Nem tölthető be a feladat.",
    progressFetchError:
      "Nem sikerült beolvasni a tanfolyam során elért eredményeket. Kérjük, próbálja meg később.",
    submitSpamFlagError: "Nem sikerült a spam jelentése",
    fetchReviewCandidatesError:
      "Probléma merül fel a válaszok partneri értékelés céljából való visszakeresése során. Kérjük, próbálja meg később.",
  },
}

export default hungarianLabels
