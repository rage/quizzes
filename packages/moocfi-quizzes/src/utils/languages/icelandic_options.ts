import { SingleLanguageLabels } from "./index"

const icelandicLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Dæmi um svar",
    userAnswerLabel: "Svar þitt",
    currentNumberOfWordsLabel: "Orðafjöldi",
    textFieldLabel: "Svar þitt",
    conformToLimitsToSubmitLabel:
      "Til þess að þú getir vistað svarið verður orðafjöldinn að vera innan settra marka",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Svarið má ekki vera meira en ${max} orð að lengd`
      }

      if (!max) {
        return `Svarið verður að vera a.m.k. ${min} orð að lengd`
      }
      return `Svarið verður að vera ${min} til ${max} orð að lengd`
    },
  },
  open: {
    placeholder: "Svar",
    userAnswerLabel: "Svar þitt",
    feedbackForSuccess: "Svarið er rétt",
    feedbackForFailure: "Svarið er rangt",
  },
  peerReviews: {
    loadingLabel: "Sæki...",
    chooseButtonLabel: "Velja",
    unselectButtonLabel: "Afturkalla val",
    chooseEssayInstruction: "Veldu eitt svar til umsagnar",
    chosenEssayInstruction: "Farðu vandlega yfir svarið sem þú valdir",
    givenPeerReviewsLabel: "Umsagnir um úrlausnir annarra nemenda",
    noPeerAnswersAvailableLabel: "Engar úrlausnir fundust sem umsögn vantar um",
    reportAsInappropriateLabel: "Senda tilkynningu um ógilda úrlausn",
    submitPeerReviewLabel: "Senda umsögn",
    peerReviewsCompletedInfo:
      "Þú hefur gefið nægilega margar umsagnir um úrlausnir annarra",
    giveExtraPeerReviews:
      "Þú hefur gefið nægilega margar umsagnir um úrlausnir annarra. Ef þú gefur enn fleiri umsagnir fær svarið þitt umsögn fyrr!",
    giveExtraPeerReviewsQuizConfirmed:
      "Þú getur haldið áfram að gefa umsagnir til að hjálpa öðrum nemendum",
    displayPeerReview: "Gefðu umsögn",
    hidePeerReviewLabel: "Fela",
    essayQuestionAnswerTextBoxLabel: "Skrifaðu umsögn",
    optionLabel: "Val",
    answerRejected: "Svarinu þínu var hafnað",
    answerFlaggedAsSpam: "Svarið þitt var tilkynnt sem ógilt svar",
    answerConfirmed: "Svarið þitt var samþykkt!",
    manualReview: "Svarið þitt verður yfirfarið hjá starfsmönnum námskeiðsins",
    peerReviewGroupTitle: "Æfingar sem metnar eru með umsögn annarra nemenda",
    peerReviewLikertDetails:
      "Merktu við hversu sammála þú ert hverri fullyrðingu. Talan 1 merkir „mjög ósammála“; talan 5 merkir „mjög sammála“.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "Meðaleinkunn samkvæmt umsögnunum sem borist hafa er",
    detailedViewLabel: "Allar umsagnir sem svarið þitt hefur fengið",
    errorLabel:
      "Kerfisvilla kom upp þegar reynt var að sækja umsagnir annarra nemenda. Vænlegast er að endurhlaða síðuna.",
    loadingLabel: "Sæki umsagnir frá öðrum nemendum...",
    noPeerReviewsReceivedlabel:
      "Svarið þitt hefur ekki fengið neina umsögn enn sem komið er",
    noSupportForQuestionTypeLabel:
      "Kerfið styður ekki spurningar af þessu tagi",
    numberOfPeerReviewsText: n =>
      `Svarið þitt hefur fengið n ${n} ${
        n > 1 ? "umsagnir" : "umsögn"
      } frá öðrum nemendum.`,
    summaryViewLabel: "Umsagnir annarra nemenda:",
    toggleButtonExpandLabel: "Sýna allar umsagnir annarra nemenda",
    toggleButtonShrinkLabel: "Fela umsagnir annarra nemenda",
    peerReviewLabel: "Umsögn frá öðrum nemanda",
    peerReviewReceived: "Þú hefur fengið nýja umsögn",
    peerReviewReceivedFor: (title: string) =>
      `Þú hefur fengið nýja umsögn um æfingu ${title} frá öðrum nemanda`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Kerfið styður ekki spurningar af gerðinni '${itemType}'.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Veldu rétt svar",
    chooseAllSuitableOptionsLabel: "Veldu allt sem við á",
    answerCorrectLabel: "Rétt",
    answerIncorrectLabel: "Rangt",
  },
  stage: {
    answerStageLabel: "Svarar æfingunni",
    givingPeerReviewsStageLabel: "Gefur umsagnir um svör annarra nemenda",
    receivingPeerReviewsStageLabel: "Bíður umsagnar annarra nemenda",
    evaluationStageLabel: "Bíður einkunnargjafar",
  },
  general: {
    pastDeadline: "Þú getur ekki lengur skráð svar við þessari spurningu.",
    answerMissingBecauseQuizModifiedLabel:
      "Spurningunni hefur ekki verið svarað. Æfingunni hefur sennilega verið breytt eftir að svarið þitt var vistað.",
    submitButtonLabel: "Vista",
    errorLabel: "Villa",
    loginToViewPromptLabel: "Skráðu þig inn til að sjá æfinguna",
    loginToAnswerPromptLabel: "Skráðu þig inn til að leysa æfinguna",
    loadingLabel: "Sæki",
    answerCorrectLabel: "Svarið er rétt",
    alreadyAnsweredLabel: "Þú hefur þegar vistað svar við þessu",
    answerIncorrectLabel: "Svarið er rangt",
    kOutOfNCorrect: (k, n) => `${k}/${n} rétt svör`,
    pointsAvailableLabel: "Hámarksstigafjöldi fyrir æfinguna",
    pointsReceivedLabel: "Stig fyrir æfinguna",
    incorrectSubmitWhileTriesLeftLabel:
      "Svarið var ekki fullkomlega rétt. Reyndu aftur!",
    triesRemainingLabel: "Tilraunir sem þú átt eftir",
    quizLabel: "Æfing",
    pointsLabel: "Stig",
    triesNotLimitedLabel: "Fjöldi tilrauna er ekki takmarkaður",
    submitGeneralFeedbackLabel: "Vistað",
    submitButtonAlreadyAnsweredLabel: "Svarað",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Engin stig fást nema svarið sé fullkomlega rétt"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Svarað",
    unanswered: "Ósvarað",
    rejected: "Svarið fékk neikvæða umsögn — reyndu aftur",
    progressUpdated: "Námskeiðsframvinda uppfærð",
    answerConfirmed: "Svarið þitt var staðfest!",
    answerConfirmedFor: (title: string) =>
      `Svarið þitt við æfingu ${title} var staðfest!`,
    courseCompleted: "Þú hefur lokið námskeiðinu!",
  },
  error: {
    submitFailedError: "Svarið þitt vistaðist ekki. Reyndu aftur seinna.",
    quizLoadFailedError: "Æfingin hlóðst ekki",
    progressFetchError:
      "Gat ekki sótt framfaragögn. Vinsamlegast reyndu aftur síðar.",
    submitSpamFlagError: "Gat ekki tilkynnt ruslpóst.",
    fetchReviewCandidatesError:
      "Eitthvað fór úrskeiðis við að sækja svör til jafningjamats. Vinsamlegast reyndu aftur síðar.",
  },
}

export default icelandicLabels
