import { SingleLanguageLabels } from "./index"

const lithuanianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Atsakymo pavyzdys",
    userAnswerLabel: "Jūsų atsakymas",
    currentNumberOfWordsLabel: "Žodžių skaičius",
    textFieldLabel: "Jūsų atsakymas",
    conformToLimitsToSubmitLabel:
      "Kad galėtumėte pateikti atsakymą, jo apimtis turi atitikti nustatytas žodžių skaičiaus ribas.",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Jūsų atsakymą turi sudaryti ne daugiau kaip ${max} žodžių.`
      }

      if (!max) {
        return `Jūsų atsakymą turi sudaryti ne mažiau kaip ${min} žodžių.`
      }

      return `Jūsų atsakymą turi sudaryti nuo ${min} iki ${max} žodžių.`
    },
  },
  open: {
    placeholder: "Atsakymas",
    userAnswerLabel: "Jūsų atsakymas",
    feedbackForFailure: "Jūsų atsakymas neteisingas.",
    feedbackForSuccess: "Jūsų atsakymas teisingas.",
  },
  peerReviews: {
    loadingLabel: "Įkeliama",
    noPeerAnswersAvailableLabel: "Tarpusavyje vertinti skirtų atsakymų nėra.",
    chooseButtonLabel: "Pasirinkti",
    unselectButtonLabel: "Atšaukti parinktį",
    chooseEssayInstruction: "Pasirinkite vieną norimą įvertinti variantą.",
    chosenEssayInstruction: "Įvertinkite pasirinktą atsakymą.",
    displayPeerReview: "Pateikti tarpusavio įvertinimą",
    giveExtraPeerReviews:
      "Pateikėte reikiamą skaičių tarpusavio įvertinimų. Jei pateiksite jų daugiau, bus greičiau įvertintas jūsų atsakymas.",
    giveExtraPeerReviewsQuizConfirmed:
      "Galite ir toliau teikti tarpusavio įvertinimus, kad padėtumėte kitiems.",
    givenPeerReviewsLabel: "Pateiktų tarpusavio įvertinimų skaičius",
    peerReviewsCompletedInfo: "Pateikėte pakankamai tarpusavio įvertinimų.",
    reportAsInappropriateLabel: "Pranešti apie brukalą",
    submitPeerReviewLabel: "Pateikti įvertinimą",
    hidePeerReviewLabel: "Slėpti",
    essayQuestionAnswerTextBoxLabel: "Rašyti įvertinimą",
    optionLabel: "Variantas",
    answerRejected: "Jūsų atsakymas atmestas.",
    answerFlaggedAsSpam: "Apie jūsų atsakymą pranešta kaip apie brukalą.",
    answerConfirmed: "Jūsų atsakymas priimtas!",
    manualReview: "Jūsų atsakymą vertina už kursą atsakingi darbuotojai.",
    peerReviewGroupTitle: "Tarpusavio atsiliepimai",
    peerReviewLikertDetails:
      "Įvertinkite kiekvieną teiginį 1-5 skalėje. 1 griežtai nesutinka ir 5 griežtai sutinka.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Bandant parodyti gautus tarpusavio įvertinimus įvyko klaida. Pabandykite iš naujo įkelti puslapį.",
    noSupportForQuestionTypeLabel:
      "Šio pobūdžio tarpusavio vertinimo klausimas negalimas.",
    loadingLabel: "Įkeliami gauti tarpusavio įvertinimai...",
    noPeerReviewsReceivedlabel:
      "Jūsų atsakymo tarpusavio įvertinimų kol kas negauta.",
    numberOfPeerReviewsText: n =>
      `Gautų jūsų atsakymo tarpusavio įvertinimų skaičius - ${n} ${
        n > 0 ? "" : ""
      }.`,
    toggleButtonExpandLabel: "Rodyti visus gautus tarpusavio įvertinimus",
    toggleButtonShrinkLabel: "Slėpti tarpusavio įvertinimus",
    averageOfGradesLabel: "Vidutinis gautų įvertinimų pažymys –",
    detailedViewLabel: "Visi gauti jūsų atsakymo įvertinimai",
    summaryViewLabel: "Gauti tarpusavio įvertinimai:",
    peerReviewLabel: "Tarpusavio vertinimas",
    peerReviewReceived: "Gavote naują tarpusavio įvertinimą.",
    peerReviewReceivedFor: (title: string) =>
      `Gavote naują jūsų pateikto ${title} pratimo atsakymo tarpusavio įvertinimą.`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `'${itemType}' tipo klausimas negalimas.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Pasirinkite teisingą atsakymą.",
    chooseAllSuitableOptionsLabel: "Pasirinkite visus tinkamus atsakymus.",
    answerCorrectLabel: "Teisinga",
    answerIncorrectLabel: "Neteisinga",
  },
  stage: {
    answerStageLabel: "Teikiamas pratimo atsakymas",
    givingPeerReviewsStageLabel: "Teikiami tarpusavio įvertinimai",
    receivingPeerReviewsStageLabel: "Gaunami tarpusavio įvertinimai",
    evaluationStageLabel: "Laukiama pažymio",
  },
  general: {
    pastDeadline: "Teikti šio pratimo atsakymo nebegalima.",
    answerMissingBecauseQuizModifiedLabel:
      "Neatsakyta į klausimą. Gali būti, kad jums pateikus atsakymą klausimynas buvo pakeistas.",
    submitButtonLabel: "Pateikti",
    errorLabel: "Klaida",
    loginToViewPromptLabel: "Jei norite pamatyti pratimą, turite prisijungti.",
    loginToAnswerPromptLabel:
      "Jei norite pateikti pratimo atsakymą, turite prisijungti.",
    loadingLabel: "Klaida",
    answerCorrectLabel: "Atsakymas teisingas.",
    alreadyAnsweredLabel: "Į šį klausimą jau atsakėte.",
    answerIncorrectLabel: "Atsakymas neteisingas.",
    kOutOfNCorrect: (k, n) => `Teisingas (-i) ${k} iš ${n} atsakymų.`,
    pointsAvailableLabel: "Už pratimą galimų gauti balų skaičius",
    pointsReceivedLabel: "Gauti balai",
    incorrectSubmitWhileTriesLeftLabel:
      "Atsakymas ne visiškai teisingas. Bandykite dar kartą.",
    triesRemainingLabel: "Likusių bandymų skaičius",
    quizLabel: "Klausimynas",
    pointsLabel: "Balai",
    triesNotLimitedLabel: "Bandymų skaičius neribojamas.",
    submitGeneralFeedbackLabel: "Pateikta",
    submitButtonAlreadyAnsweredLabel: "Atsakyta",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Balai skiriami tik jei atsakymas visiškai teisingas."
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Atsakyta",
    unanswered: "Neatsakyta",
    rejected: "Jūsų atsakymas buvo atmestas, bandykite dar kartą",
    progressUpdated: "Duomenys apie pasiektą kurso etapą atnaujinti.",
    answerConfirmed: "Jūsų atsakymas patvirtintas.",
    answerConfirmedFor: (title: string) =>
      `Jūsų pateiktas ${title} pratimo atsakymas patvirtintas.`,
    courseCompleted: "Jūs baigėte kursą!",
  },
  error: {
    submitFailedError:
      "Nepavyko nusiųsti jūsų atsakymo. Bandykite dar kartą vėliau.",
    quizLoadFailedError: "Nepavyko įkelti pratimo.",
    progressFetchError:
      "Nepavyko gauti duomenų apie pasiektą kurso etapą. Bandykite dar kartą vėliau.",
    submitSpamFlagError: "Nepavyko pranešti apie brukalą.",
    fetchReviewCandidatesError:
      "Ieškant tarpusavyje vertinti skirtų atsakymų įvyko klaida. Bandykite dar kartą vėliau.",
  },
}

export default lithuanianLabels
