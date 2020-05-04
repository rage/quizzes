import { SingleLanguageLabels } from "./index"

const latvianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Atbildes piemērs",
    userAnswerLabel: "Jūsu atbilde",
    currentNumberOfWordsLabel: "Vārdi",
    textFieldLabel: "Jūsu atbilde",
    conformToLimitsToSubmitLabel:
      "Lai atbildi varētu iesniegt, pārbaudiet, vai vārdu skaits ir noteiktajās robežās!",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Atbilde nedrīkst pārsniegt ${max} vārdus`
      }

      if (!max) {
        return `Atbildē jābūt vismaz ${min} vārdiem.`
      }

      return `Atbildē jābūt ${min}-${max} vārdiem.`
    },
  },
  open: {
    placeholder: "Atbilde",
    userAnswerLabel: "Jūsu atbilde",
    feedbackForFailure: "Atbilde nav pareiza.",
    feedbackForSuccess: "Atbilde pareiza.",
  },
  peerReviews: {
    loadingLabel: "Notiek ielāde",
    noPeerAnswersAvailableLabel: "Nav recenzēšanai pieejamu atbilžu.",
    chooseButtonLabel: "Atlasīt",
    unselectButtonLabel: "Atcelt atlasīto",
    chooseEssayInstruction: "Izvēlēties vienu no šiem recenzēšanai!",
    chosenEssayInstruction: "Recenzējiet atlasīto atbildi!",
    displayPeerReview: "Sniedziet atzinumu par līdzbiedra atbildi!",
    giveExtraPeerReviews:
      "No jums saņemts prasītais atzinumu skaits. Jo vairāk atzinumu sniegsit, jo ātrāk saņemsit atzinumu par savu atbildi.",
    giveExtraPeerReviewsQuizConfirmed:
      "Varat turpināt sniegt atzinumus, lai palīdzētu citiem.",
    givenPeerReviewsLabel: "Sniegtie atzinumi",
    peerReviewsCompletedInfo: "No jums jau atzinumi saņemti pietiekamā skaitā.",
    reportAsInappropriateLabel: "Sūdzēties par mēstuli",
    submitPeerReviewLabel: "Iesniegt atzinumu",
    hidePeerReviewLabel: "Paslēpt",
    essayQuestionAnswerTextBoxLabel: "Rakstīt atzinumu",
    optionLabel: "Izvēles iespēja",
    answerRejected: "Jūsu atbilde ir noraidīta.",
    answerFlaggedAsSpam: "Par jūsu atbildi ziņots, ka tā esot mēstule.",
    answerConfirmed: "Jūsu atbilde ir akceptēta!",
    manualReview: "Jūsu atbildi izskata kursa rīkotāji.",
    peerReviewGroupTitle: "Salīdzinošās vērtēšanas jautājumi",
    peerReviewLikertDetails:
      "Lūdzu, novērtējiet katru apgalvojumu no 1 līdz 5, 1 nozīmē, ka nepiekrītu, un 5, kas pilnīgi piekrīt.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Parādot saņemtos atzinumus, gadījās kļūda. Mēģiniet lapu pārlādēt!",
    noSupportForQuestionTypeLabel: "Tādi jautājumi recenzēšanā nav paredzēti.",
    loadingLabel: "Notiek saņemto atzinumu ielāde...",
    noPeerReviewsReceivedlabel: "Vēl nav neviena atzinuma par jūsu atbildi.",
    numberOfPeerReviewsText: n =>
      `Par jūsu atbildi saņemto atzinumu skaits: ${n}.`,
    toggleButtonExpandLabel: "Parādīt visus saņemtos atzinumus",
    toggleButtonShrinkLabel: "Paslēpt atzinumus",
    averageOfGradesLabel: "Saņemtajos atzinumos vidējā atzīme ir",
    detailedViewLabel: "Visi saņemtie atzinumi par jūsu atbildi",
    summaryViewLabel: "Saņemtie atzinumi:",
    peerReviewLabel: "Recenzēšana",
    peerReviewReceived: "Jūs esat saņēmis jaunu salīdzinošo pārskatu",
    peerReviewReceivedFor: (title: string) =>
      `Jūs esat saņēmis jaunu salīdzinošo pārskatu par ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `'${itemType}'veida jautājumi nav paredzēti.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Atlasiet pareizo atbildi!",
    chooseAllSuitableOptionsLabel: "Atlasiet visu attiecīgo!",
    answerCorrectLabel: "Pareizi",
    answerIncorrectLabel: "Nepareizi",
  },
  stage: {
    answerStageLabel: "Atbildēšana uz uzdevumu",
    givingPeerReviewsStageLabel: "Atzinumu sniegšana",
    receivingPeerReviewsStageLabel: "Atzinumu saņemšana",
    evaluationStageLabel: "Gaida atzīmi",
  },
  general: {
    pastDeadline: "Šajā uzdevumā vairs nevar iesniegt atbildi.",
    answerMissingBecauseQuizModifiedLabel:
      "Uz jautājumu nav atbildēts. Kontroldarba uzdevums var būt mainījies pēc jūsu atbildes iesniegšanas.",
    submitButtonLabel: "Iesniegt",
    errorLabel: "Kļūda",
    loginToViewPromptLabel: "Ieejiet, lai uzdevumu apskatītu!",
    loginToAnswerPromptLabel: "Ieejiet, lai uzdevumu izpildītu!",
    loadingLabel: "Notiek ielāde",
    answerCorrectLabel: "Atbilde pareiza",
    alreadyAnsweredLabel: "Uz šo jau atbildējāt.",
    answerIncorrectLabel: "Atbilde nav pareiza",
    kOutOfNCorrect: (k, n) => `Pareizi atbildēts ${k}/${n}.`,
    pointsAvailableLabel: "Par uzdevumu var saņemt šādu skaitu punktu:",
    pointsReceivedLabel: "Saņemtie punkti",
    incorrectSubmitWhileTriesLeftLabel:
      "Atbilde nebija pilnīgi pareiza. Mēģiniet vēlreiz!",
    triesRemainingLabel: "Palikušie mēģinājumi:",
    quizLabel: "Kontroldarbs",
    pointsLabel: "Punkti",
    triesNotLimitedLabel: "Mēģinājumu skaits nav ierobežots.",
    submitGeneralFeedbackLabel: "Iesniegts:",
    submitButtonAlreadyAnsweredLabel: "Atbildēts:",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Lai saņemtu punktus, atbildei jābūt pilnīgi pareizai."
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Atbildēja",
    unanswered: "Neatbildēts",
    rejected: "Atbilde noraidīta. Lūdzu, mēģiniet vēlreiz",
    progressUpdated: "Atjaunināti dati par to, cik tālu kurss nokārtots.",
    answerConfirmed: "Jūsu atbilde ir apstiprināta!",
    answerConfirmedFor: (title: string) =>
      `Jūsu atbilde ${title} uzdevumā ir apstiprināta!`,
    courseCompleted: "Kurss pabeigts!",
  },
  error: {
    submitFailedError: "Atbildi nevarēja nosūtīt. Vēlāk mēģiniet vēlreiz!",
    quizLoadFailedError: "Nevarēja ielādēt uzdevumu.",
    progressFetchError:
      "Nevarēja iegūt datus par to, cik tālu kurss nokārtots. Vēlāk mēģiniet vēlreiz!",
    submitSpamFlagError: "Nevarēja pasūdzēties par mēstuli.",
    fetchReviewCandidatesError:
      "Misējās recenzējamo atbilžu izgūšana. Vēlāk mēģiniet vēlreiz!",
  },
}

export default latvianLabels
