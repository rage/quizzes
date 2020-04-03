import { SingleLanguageLabels } from "./index"

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Näide",
    userAnswerLabel: "Sinu vastus",
    currentNumberOfWordsLabel: "Sõnade arv",
    textFieldLabel: "Teie vastus",
    conformToLimitsToSubmitLabel:
      "Kontrolli, et sinu vastus mahub sõnade limiiti",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Sinu vastus ei tohiks ületada ${max} sõna`
      }

      if (!max) {
        return `Sinu vastus peaks olema vähemalt ${min} sõna `
      }

      return `Sinu vastus peaks olema ${min} ja ${max} sõna piires`
    },
  },
  open: {
    placeholder: "Vastus",
    userAnswerLabel: "Sinu vastus",
    feedbackForFailure: "Sinu vastus ei ole õige",
    feedbackForSuccess: "Sinu vastus on õige",
  },
  peerReviews: {
    loadingLabel: "Laeb",
    noPeerAnswersAvailableLabel: "Hinnanguid ei ole",
    chooseButtonLabel: "Vali",
    unselectButtonLabel: "Tühista valik",
    chooseEssayInstruction: "Vali üks, millele hinnang anda",
    chosenEssayInstruction: "Anna hinnang valitud vastusele:",
    displayPeerReview: "Anna vastastikune hinnang",
    giveExtraPeerReviews:
      "Oled andnud piisava arvu vastastikuseid hinnanguid. Kui annad rohkem hinnanguid, siis ka sinu vastuseid vaadatakse kiiremini läbi!",
    giveExtraPeerReviewsQuizConfirmed:
      "Võid anda veel hinnanguid, et teistele abiks olla",
    givenPeerReviewsLabel: "Vastastikune hindamine tehtud",
    peerReviewsCompletedInfo: "Oled andnud piisavalt hinnanguid",
    reportAsInappropriateLabel: "Anna teada spämmist",
    submitPeerReviewLabel: "Esita hinnang",
    hidePeerReviewLabel: "Peida",
    essayQuestionAnswerTextBoxLabel: "Kirjuta hinnang",
    optionLabel: "Valik",
    answerRejected: "Sinu vastus on tagasi lükatud",
    answerFlaggedAsSpam: "Sinu vastus on märgitud spämmiks",
    answerConfirmed: "Sinu vastus on vastu võetud!",
    manualReview: "Sinu vastust vaatab läbi kursuse koordinaator",
  },
  receivedPeerReviews: {
    errorLabel:
      "Ilmnes viga hinnangute laadimisel. Palun proovi lehte uuesti laadida.",
    noSupportForQuestionTypeLabel: "Seda sorti hinnangu küsimus pole toetatud.",
    loadingLabel: "Laetakse kogutud hinnanguid...",
    noPeerReviewsReceivedlabel: "Sinu vastusele pole veel hinnangut antud",
    numberOfPeerReviewsText: n =>
      `Sinu vastus on saanud n vastastikust hinnangut`,
    toggleButtonExpandLabel: "Näita kõiki saadud hinnanguid",
    toggleButtonShrinkLabel: "Peida hinnangud",
    averageOfGradesLabel: "Keskmine hinne saadud hinnangutel on",
    detailedViewLabel: "Kõik hinnangud, mis sinu vastusele on antud",
    summaryViewLabel: "Saadud hinnangud:",
    peerReviewLabel: "Vastastikused hinnangud",
    peerReviewReceived: "Oled saanud uue vastastikuse hinnangu",
    peerReviewReceivedFor: (title: string) =>
      `Oled saanud uue vastastikuse hinnangu ülesandes ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `'${itemType}' tüüpi küsimused pole toetatud.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Vali õige vastus",
    chooseAllSuitableOptionsLabel: "vali kõik, mis sobivad.",
    answerCorrectLabel: "Õige",
    answerIncorrectLabel: "Vale",
  },
  stage: {
    answerStageLabel: "Harjutusele vastamine",
    givingPeerReviewsStageLabel: "Vastastikuse hinnangu andmine",
    receivingPeerReviewsStageLabel: "Vastastikuse hinnangu ootel",
    evaluationStageLabel: "Hinnangu ootel",
  },
  general: {
    pastDeadline: "Enam ei saa harjutusele vastust anda",
    answerMissingBecauseQuizModifiedLabel:
      "Küsimusele pole vastatud. Küsimustikku on tõenäoliselt pärast sinu vastust muudetud.",
    submitButtonLabel: "Esita",
    errorLabel: "Viga",
    loginToViewPromptLabel: "Logi sisse, et ülesannet vaadata",
    loginToAnswerPromptLabel: "Logi sisse, et ülesannet vaadata",
    loadingLabel: "Laeb",
    answerCorrectLabel: "Vastus on õige",
    alreadyAnsweredLabel: "Sa oled juba sellele vastanud",
    answerIncorrectLabel: "Vastus pole õige",
    kOutOfNCorrect: (k, n) => `${k}/${n} õiget vastust`,
    pointsAvailableLabel: "Ülesande eest saadavad punktid",
    pointsReceivedLabel: "Saadud punktid",
    incorrectSubmitWhileTriesLeftLabel:
      "Vastus pole täielikult õige. Palun proovi uuesti!",
    triesRemainingLabel: "Kaitseid jäänud",
    quizLabel: "Küsitlus",
    pointsLabel: "Punktid",
    triesNotLimitedLabel: "Katsete arv ei ole piiratud",
    submitGeneralFeedbackLabel: "Esitatud",
    submitButtonAlreadyAnsweredLabel: "Vastatud",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Punktide saamiseks peab vastus täielikult õige olema"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    // These three are in elements of ai messages
    answered: "Vastatud",
    unanswered: "Ei vastatud",
    rejected: "Sinu vastus on tagasi lükatud. Palun proovi uuesti",
    progressUpdated: "Kursuse progress uuendatud",
    answerConfirmed: "Sinu vastus on kinnitatud!",
    answerConfirmedFor: (title: string) =>
      `Sinu vastus ülesandes ${title} on kinnitatud!`,
    courseCompleted: "Oled kursuse lõpetanud!",
  },
  error: {
    submitFailedError: "Ei saanud vastust saata. Palun proovi hiljem uuesti.",
    quizLoadFailedError: "Ei saanud harjutust laadida.",
    progressFetchError:
      "Ei saanud kursuse staatuse infot laadida. Palun proovi hiljem uuesti.",
    submitSpamFlagError: "Ei saanud spämmi raporteerida",
    fetchReviewCandidatesError:
      "Midagi läks valesti. Palun proovi hiljem uuesti.",
  },
}

export default finnishLabels
