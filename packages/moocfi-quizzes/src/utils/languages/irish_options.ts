import { SingleLanguageLabels } from "./index"

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Freagra samplach",
    userAnswerLabel: "An freagra uait",
    currentNumberOfWordsLabel: "Focail",
    textFieldLabel: "An freagra uait",
    conformToLimitsToSubmitLabel:
      "Le bheith in ann an freagra a sheoladh isteach, bíodh sé ag cloí leis na teorainneacha ó thaobh líon na bhfocal de",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Níor cheart níos mó ná n ${max} focal a bheith sa fhreagra uait`
      }

      if (!max) {
        return `Ba cheart ${min} focal ar a laghad a bheith sa fhreagra uait`
      }

      return `Ba cheart idir ${min} agus ${max} focal a bheith sa fhreagra uait`
    },
  },
  open: {
    placeholder: "Freagra",
    userAnswerLabel: "An freagra uait",
    feedbackForFailure: "Níl an freagra uait ceart",
    feedbackForSuccess: "Tá an freagra uait ceart",
  },
  peerReviews: {
    loadingLabel: "Ag lódáil",
    noPeerAnswersAvailableLabel:
      "Níl aon fhreagra ar fáil don athbhreithniú piaraí",
    chooseButtonLabel: "Roghnaigh",
    unselectButtonLabel: "Cuir an roghnú ar ceal",
    chooseEssayInstruction: "Pioc rogha amháin le hathbhreithniú",
    chosenEssayInstruction: "Déan athbhreithniú ar an bhfreagra a phioc tú:",
    displayPeerReview: "Tabhair athbhreithniú piaraí",
    giveExtraPeerReviews:
      "Níor thug tú an líon athbhreithnithe piaraí a theastaíonn. Má dhéanann tú tuilleadh athbhreithnithe piaraí déanfar athbhreithniú níos tapa ar an bhfreagra uait!",
    giveExtraPeerReviewsQuizConfirmed:
      "Is féidir leat athbhreithnithe piaraí a thabhairt fós le cabhrú le daoine eile",
    givenPeerReviewsLabel: "Athbhreithnithe piaraí a tugadh",
    peerReviewsCompletedInfo: "Tá dóthain athbhreithnithe piaraí tugtha agat",
    reportAsInappropriateLabel: "Tuairiscigh mar thurscar",
    submitPeerReviewLabel: "Seol an t-athbhreithniú isteach",
    hidePeerReviewLabel: "Folaigh",
    essayQuestionAnswerTextBoxLabel: "Scríobh athbhreithniú",
    optionLabel: "Rogha",
    answerRejected: "Diúltaíodh don fhreagra uait",
    answerFlaggedAsSpam: "Tuairiscíodh an freagra uait mar thurscar",
    answerConfirmed: "Glacadh leis an bhfreagra uait!",
    manualReview:
      "Tá an freagra uait á athbhreithniú ag baill foirne an chúrsa",
    peerReviewGroupTitle: "Peer review questions",
    peerReviewLikertDetails:
      "Evaluate each statement on a scale of 1-5. 1 means strongly disagree, 5 means strongly agree.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Tharla earráid agus na hathbhreithnithe piaraí a fuarthas á dtaispeáint. Bain triail as an leathanach a athlódáil.",
    noSupportForQuestionTypeLabel:
      "Ní thacaítear le freagra athbhreithnithe piaraí den chineál sin",
    loadingLabel: "Tá na hathbhreithnithe piaraí a fuarthas á lódáil...",
    noPeerReviewsReceivedlabel:
      "Níl aon athbhreithniú piaraí faighte ag an bhfreagra uait fós",
    numberOfPeerReviewsText: n =>
      `Tá ${n} athbhreithniú piaraí faighte ag an bhfreagra uait.`,
    toggleButtonExpandLabel: "Taispeáin gach athbhreithniú piaraí a fuarthas",
    toggleButtonShrinkLabel: "Cuir na hathbhreithnithe piaraí i bhfolach",
    averageOfGradesLabel: "Is é meánghrád na n-athbhreithnithe a fuarthas ná",
    detailedViewLabel:
      "Gach athbhreithniú atá faighte i leith an fhreagra uait",
    summaryViewLabel: "Athbhreithnithe piaraí atá faighte:",
    peerReviewLabel: "Athbhreithniú piaraí",
    peerReviewReceived: "Fuair tú athbhreithniú piaraí nua",
    peerReviewReceivedFor: (title: string) =>
      `Ní thacaítear le freagra de chineál ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Ní thacaítear le freagra de chineál '${itemType}'.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Roghnaigh an freagra ceart",
    chooseAllSuitableOptionsLabel: "Roghnaigh gach ceann is infheidhme.",
    answerCorrectLabel: "Ceart",
    answerIncorrectLabel: "Mícheart",
  },
  stage: {
    answerStageLabel: "An cleachtadh á fhreagairt",
    givingPeerReviewsStageLabel: "Athbhreithnithe piaraí á dtabhairt",
    receivingPeerReviewsStageLabel: "Athbhreithnithe piaraí á bhfáil",
    evaluationStageLabel: "Ag fanacht ar ghrádú",
  },
  general: {
    pastDeadline:
      "Ní féidir leat freagra a thabhairt ar an gcleachtadh seo a thuilleadh",
    answerMissingBecauseQuizModifiedLabel:
      "Ceist nár freagraíodh. Is dócha gur athraíodh an cleachtadh tar éis duit freagra a thabhairt.",
    submitButtonLabel: "Seol",
    errorLabel: "Earráid",
    loginToViewPromptLabel: "Logáil isteach le féachaint ar an gcleachtadh",
    loginToAnswerPromptLabel: "Logáil isteach chun an cleachtadh a fhreagairt",
    loadingLabel: "Ag lódáil",
    answerCorrectLabel: "Tá an freagra ceart",
    alreadyAnsweredLabel: "D’fhreagair tú é seo cheana féin",
    answerIncorrectLabel: "Níl an freagra ceart",
    kOutOfNCorrect: (k, n) => `Tá ${k}/${n} freagra ceart`,
    pointsAvailableLabel: "Na pointí atá ar fáil don chleachtadh",
    pointsReceivedLabel: "Na pointí a fuarthas",
    incorrectSubmitWhileTriesLeftLabel:
      "Ní raibh an freagra iomlán ceart. Bain triail as arís!",
    triesRemainingLabel: "Iarrachtaí atá fágtha:",
    quizLabel: "Cleachtadh",
    pointsLabel: "Pointí",
    triesNotLimitedLabel: "Níl aon teorainn ar líon na n-iarrachtaí",
    submitGeneralFeedbackLabel: "Seolta",
    submitButtonAlreadyAnsweredLabel: "Freagartha",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Chun pointí a fháil is gá an freagra a bheith iomlán ceart"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Freagartha",
    unanswered: "Gan freagra",
    rejected: "Rejected answer, try again",
    progressUpdated: "Tugadh an dul chun cinn sa chúrsa cothrom le dáta",
    answerConfirmed: "Deimhníodh an freagra uait!",
    answerConfirmedFor: (title: string) =>
      `Deimhníodh an freagra uait ar an gcleachtadh ${title}!`,
    courseCompleted: "Tá an cúrsa críochnaithe agat!",
  },
  error: {
    submitFailedError:
      "Níorbh fhéidir an freagra uait a sheoladh. Bain triail as arís ar ball.",
    quizLoadFailedError: "Níorbh fhéidir an cleachtadh a lódáil",
    progressFetchError:
      "Níorbh fhéidir na sonraí faoin dul chun cinn sa chúrsa a aisghabháil. Bain triail as arís ar ball.",
    submitSpamFlagError: "Níorbh fhéidir turscar a thuairisciú",
    fetchReviewCandidatesError:
      "Tharla fadhb agus na freagraí don athbhreithniú piaraí á n-aisghabháil. Bain triail as arís ar ball.",
  },
}

export default finnishLabels
