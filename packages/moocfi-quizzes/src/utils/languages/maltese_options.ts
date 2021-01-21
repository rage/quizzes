import { SingleLanguageLabels } from "./index"

const malteseLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Eżempju ta’ tweġiba",
    userAnswerLabel: "Eżempju ta’ tweġiba",
    currentNumberOfWordsLabel: "Kliem",
    textFieldLabel: "It-tweġiba tiegħek",
    conformToLimitsToSubmitLabel:
      "Biex tkun tista’ tissottometti t-tweġiba tiegħek, taqbiżx il-limitu ta’ kliem",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Il-kliem fit-tweġiba tiegħek m’għandux ikun iżjed minn ${max}`
      }

      if (!max) {
        return `It-tweġiba tiegħek għandha tkun ta’ tul ta’ mill-inqas ${min} kelmiet`
      }
      return `Il-kliem fit-tweġiba tiegħek għandu jkun bejn ${min} u ${max} .`
    },
  },
  open: {
    placeholder: "Tweġiba",
    userAnswerLabel: "It-tweġiba tiegħek",
    feedbackForSuccess: "It-tweġiba tiegħek mhix tajba",
    feedbackForFailure: "It-tweġiba tiegħek hija tajba",
  },
  peerReviews: {
    loadingLabel: "Qed jillowdja",
    chooseButtonLabel: "Agħżel",
    unselectButtonLabel: "Ikkanċella l-għażla",
    chooseEssayInstruction: "Agħżel opzjoni waħda għal valutazzjoni",
    chosenEssayInstruction: "Ivvaluta t-tweġiba li għażilt",
    givenPeerReviewsLabel: "Valutazzjonijiet bejn il-pari magħmula",
    noPeerAnswersAvailableLabel:
      "M'hemm l-ebda tweġiba disponibbli għall-valutazzjoni bejn il-pari",
    reportAsInappropriateLabel: "Irrapporta bħala spam",
    submitPeerReviewLabel: "Issottometti valutazzjoni",
    peerReviewsCompletedInfo: "Għamilt biżżejjed valutazzjonijiet bejn il-pari",
    giveExtraPeerReviews:
      "Inti għamilt l-għadd meħtieġ ta’ valutazzjonijiet bejn il-pari. Jekk tagħmel aktar valutazzjonijiet bejn il-pari, it-tweġiba tiegħek tiġi vvalutata aktar malajr.",
    giveExtraPeerReviewsQuizConfirmed:
      "Xorta waħda tista’ tagħmel valutazzjonijiet bejn il-pari biex tgħin lil ħaddieħor",
    displayPeerReview: "Agħti valutazzjoni bejn il-pari",
    hidePeerReviewLabel: "Aħbi",
    essayQuestionAnswerTextBoxLabel: "Ikteb valutazzjoni",
    optionLabel: "Opzjoni",
    answerRejected: "It-tweġiba tiegħek ġiet miċħuda",
    answerFlaggedAsSpam: "It-tweġiba tiegħek ġiet irrappurtata bħala spam",
    answerConfirmed: "It-tweġiba tiegħek ġiet aċċettata!",
    manualReview: "It-tweġiba tiegħek qed janalizzaha l-persunal tal-kors",
    peerReviewGroupTitle: "Tweġibiet (Valutazzjoni bejn il-pari)",
    peerReviewLikertDetails:
      "Evalwa kull dikjarazzjoni fuq skala ta '1-5. 1 tfisser li ma naqbilx sew, 5 ifisser naqbel bil-qawwa.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel:
      "Il-medja tal-marki tal-valutazzjonijiet riċevuti hija",
    detailedViewLabel:
      "Il-valutazzjonijiet kollha li rċeviet it-tweġiba tiegħek",
    errorLabel:
      "Seħħ żball waqt li kienu qed jintwerew il-valutazzjonijiet bejn il-pari. Jekk jogħġbok ipprova erġa’ llowdja l-paġna.",
    loadingLabel: "Il-valutazzjonijiet bejn il-pari qed jillowdjaw...",
    noPeerReviewsReceivedlabel:
      "It-tweġiba tiegħek għadu ma sarilha l-ebda valutazzjoni bejn il-pari",
    noSupportForQuestionTypeLabel:
      "Din it-tip ta’ tweġiba għal valutazzjonijiet bejn il-pari mhix appoġġata",
    numberOfPeerReviewsText: n =>
      `It-tweġiba tiegħek irċeviet ${n} valutazzjoni(jiet) bejn il-pari`,
    summaryViewLabel: "Valutazzjonijiet bejn il-pari li waslu:",
    toggleButtonExpandLabel:
      "Uri l-valutazzjonijiet bejn il-pari kollha li waslu",
    toggleButtonShrinkLabel: "Aħbi",
    peerReviewLabel: "Valutazzjoni bejn il-pari",
    peerReviewReceived: "Irċevejt valutazzjoni bejn il-pari ġdida",
    peerReviewReceivedFor: (title: string) =>
      `Irċevejt valutazzjoni bejn il-pari ġdida fl-eżerċizzju ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Tweġiba tat-tip '${itemType}' mhix appoġġata.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Agħżel it-tweġiba t-tajba",
    chooseAllSuitableOptionsLabel: "Agħżel dawk kollha li japplikaw",
    answerCorrectLabel: "Korretta",
    answerIncorrectLabel: "Żbaljata",
  },
  stage: {
    answerStageLabel: "Naħdmu l-eżerċizzju",
    givingPeerReviewsStageLabel: "Nagħmlu analiżijiet bejn il-pari",
    receivingPeerReviewsStageLabel: "Nirċievu valutazzjonijiet bejn il-pari",
    evaluationStageLabel: "Stennija għall-immarkar",
  },
  general: {
    pastDeadline: "M’għadekx tista’ twieġeb dan l-eżerċizzju",
    answerMissingBecauseQuizModifiedLabel:
      "Mistoqsija mhux imwieġba. Il-kwiżż aktarx inbidel wara t-tweġiba tiegħek.",
    submitButtonLabel: "Issottometti",
    errorLabel: "Żball",
    loginToViewPromptLabel: "Illoggja biex tara l-eżerċizzju",
    loginToAnswerPromptLabel: "Illoggja biex twieġeb l-eżerċizzju",
    loadingLabel: "Qed jillowdja",
    answerCorrectLabel: "It-tweġiba hija korretta",
    alreadyAnsweredLabel: "Din il-mistoqsija diġà weġibtha",
    answerIncorrectLabel: "It-tweġiba mhix tajba",
    kOutOfNCorrect: (k, n) => `${k}/${n} tweġibiet korretti`,
    pointsAvailableLabel: "Punti disponibbli għall-eżerċizzju",
    pointsReceivedLabel: "Punti riċevuti",
    incorrectSubmitWhileTriesLeftLabel:
      "It-tweġiba ma kinitx korretta kollha. Jekk jogħġbok erġa’ pprova!",
    triesRemainingLabel: "Ċansijiet li fadal",
    quizLabel: "Kwiżż",
    pointsLabel: "Punti",
    triesNotLimitedLabel: "Tista’ tipprova kemm-il darba trid",
    submitGeneralFeedbackLabel: "Sottomess",
    submitButtonAlreadyAnsweredLabel: "Imwieġba",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Biex tirċievi l-punti, it-tweġiba trid tkun korretta kollha"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Imwieġba",
    unanswered: "Mingħajr risposta",
    rejected: "It-tweġiba tiegħek ġiet miċħuda, erġa 'pprova",
    progressUpdated: "Il-progress fil-kors ġie aġġornat",
    answerConfirmed: "It-tweġiba tiegħek ġiet ikkonfermata!",
    answerConfirmedFor: (title: string) =>
      `It-tweġiba tiegħek għall-eżerċizzju  ${title} ġiet ikkonfermata!`,
    courseCompleted: "Lestejt il-kors!",
  },
  error: {
    submitFailedError:
      "It-tweġiba tiegħek ma setgħetx tintbagħat. Jekk jogħġbok erġa’ prova aktar tard.",
    quizLoadFailedError: "L-eżerċizzju ma setax jiġi llowdjat",
    progressFetchError:
      "Id-data dwar il-progress fil-kors ma setgħetx tinstab. Jekk jogħġbok erġa’ prova aktar tard.",
    submitSpamFlagError: "Ir-rapport dwar l-ispam ma setax jinħareġ",
    fetchReviewCandidatesError:
      "Kien hemm problema bl-irkuprar tat-tweġibiet għall-valutazzjoni bejn il-pari. Jekk jogħġbok erġa’ prova aktar tard.",
  },
}

export default malteseLabels
