import { SingleLanguageLabels } from "./index"

const slovakLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Vzorová odpoveď",
    userAnswerLabel: "Vaša odpoveď",
    currentNumberOfWordsLabel: "Počet slov",
    textFieldLabel: "Vaša odpoveď",
    conformToLimitsToSubmitLabel:
      "Aby ste mohli odoslať odpoveď, uistite sa, že ste dodržali počet slov.",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Vaša odpoveď by nemala mať viac než ${max}  slov.`
      }

      if (!max) {
        return `Vaša odpoveď by mala mať aspoň ${min} slov.`
      }
      return `Vaša odpoveď by mala mať ${min} až ${max} slov.`
    },
  },
  open: {
    placeholder: "Odpoveď",
    userAnswerLabel: "Vaša odpoveď",
    feedbackForSuccess: "Vaša odpoveď je správna.",
    feedbackForFailure: "Vaša odpoveď je nesprávna.",
  },
  peerReviews: {
    loadingLabel: "Načítava sa...",
    chooseButtonLabel: "Vybrať",
    unselectButtonLabel: "Zrušiť výber",
    chooseEssayInstruction: "Vybrať jednu možnosť na hodnotenie",
    chosenEssayInstruction: "Ohodnotiť odpoveď, ktorú ste vybrali",
    givenPeerReviewsLabel: "Počet poskytnutých hodnotení.",
    noPeerAnswersAvailableLabel:
      "Nie sú k dispozícii žiadne odpovede na hodnotenie.",
    reportAsInappropriateLabel: "Nahlásiť ako spam",
    submitPeerReviewLabel: "Odoslať hodnotenie",
    peerReviewsCompletedInfo: "Poskytli ste dostatočný počet hodnotení.",
    giveExtraPeerReviews:
      "Poskytli ste požadovaný počet hodnotení. Ak poskytnete viac hodnotení, vaša odpoveď bude ohodnotená rýchlejšie!",
    giveExtraPeerReviewsQuizConfirmed:
      "Môžete pokračovať v hodnoteniach, aby ste pomohli ostatným.",
    displayPeerReview: "Ohodnotiť",
    hidePeerReviewLabel: "Skryť",
    essayQuestionAnswerTextBoxLabel: "Napísať hodnotenie",
    optionLabel: "Možnosť",
    answerRejected: "Vaša odpoveď bola zamietnutá.",
    answerFlaggedAsSpam: "Vaša odpoveď bola nahlásená ako spam.",
    answerConfirmed: "Vaša odpoveď bola prijatá!",
    manualReview: "Vašu odpoveď hodnotia lektori.",
    peerReviewGroupTitle: "Peer review questions",
    peerReviewLikertDetails:
      "Evaluate each statement on a scale of 1-5. 1 means strongly disagree, 5 means strongly agree.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "Priemerná známka prijatých hodnotení je",
    detailedViewLabel: "Priemerná známka prijatých hodnotení je",
    errorLabel: "Chyba",
    loadingLabel: "Načítavajú sa prijaté hodnotenia...",
    noPeerReviewsReceivedlabel: "Vašu odpoveď ešte nikto neohodnotil.",
    noSupportForQuestionTypeLabel:
      "Tento druh otázky na hodnotenie nie je podporovaný.",
    numberOfPeerReviewsText: n =>
      `Prijaté hodnotenia:Počet hodnotení vašej odpovede je ${n}.`,
    summaryViewLabel: "Prijaté hodnotenia:",
    toggleButtonExpandLabel: "Zobraziť všetky prijaté hodnotenia",
    toggleButtonShrinkLabel: "Skryť",
    peerReviewLabel: "Hodnotenie",
    peerReviewReceived: "Dostali ste nové hodnotenie.",
    peerReviewReceivedFor: (title: string) =>
      `Dostali ste nové hodnotenie za cvičenie ${title}.`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Otázka typu '${itemType}' nie je podporovaná.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Vybrať správnu odpoveď",
    chooseAllSuitableOptionsLabel: "Vyberať všetky vhodné možnosti",
    answerCorrectLabel: "Správne",
    answerIncorrectLabel: "Nesprávne",
  },
  stage: {
    answerStageLabel: "Práca na cvičení",
    givingPeerReviewsStageLabel: "Ohodnocovanie",
    receivingPeerReviewsStageLabel: "Čakanie na hodnotenia",
    evaluationStageLabel: "Čakanie na známku",
  },
  general: {
    pastDeadline: "Toto cvičenie už nemožno vypracovať.",
    answerMissingBecauseQuizModifiedLabel:
      "Otázka nezodpovedaná. Otázky boli pravdepodobne upravené potom, ako ste odpovedali.",
    submitButtonLabel: "Odoslať",
    errorLabel: "Chyba",
    loginToViewPromptLabel: "Prihlásiť sa na zobrazenie cvičenia",
    loginToAnswerPromptLabel: "Prihlásiť sa na vypracovanie cvičenia",
    loadingLabel: "Načítava sa...",
    answerCorrectLabel: "Odpoveď je správna.",
    alreadyAnsweredLabel: "Na túto otázku ste už odpovedali.",
    answerIncorrectLabel: "Odpoveď je nesprávna.",
    kOutOfNCorrect: (k, n) => `Počet správnych odpovedí je ${k}/${n}.`,
    pointsAvailableLabel: "Celkový počet bodov, ktoré možno získať za cvičenie",
    pointsReceivedLabel: "Počet získaných bodov",
    incorrectSubmitWhileTriesLeftLabel:
      "Odpoveď nebola úplne správna. Skúste to znova!",
    triesRemainingLabel: "Zostávajúci počet pokusov",
    quizLabel: "Otázky",
    pointsLabel: "Počet bodov",
    triesNotLimitedLabel: "Počet pokusov nie je obmedzený",
    submitGeneralFeedbackLabel: "Odoslané",
    submitButtonAlreadyAnsweredLabel: "Zodpovedané",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Na získanie bodov musí byť odpoveď úplne správna."
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Zodpovedané",
    unanswered: "Nezodpovedaný",
    rejected: "Odmietnutá odpoveď, skúste znova",
    progressUpdated: "Pokrok v kurze aktualizovaný.",
    answerConfirmed: "Vaša odpoveď bola potvrdená.",
    answerConfirmedFor: (title: string) =>
      `Vaša odpoveď v cvičení ${title} bola potvrdená!`,
    courseCompleted: "Kurz ste úspešne absolvovali!",
  },
  error: {
    submitFailedError:
      "Vašu odpoveď nebolo možné odoslať. Skúste to znova neskôr.",
    quizLoadFailedError: "Cvičenie nebolo možné načítať.",
    progressFetchError:
      "Nebolo možné získať údaje o pokroku v kurze. Skúste to znova neskôr.",
    submitSpamFlagError: "Nebolo možné nahlásiť spam.",
    fetchReviewCandidatesError:
      "Pri načítavaní odpovedí určených na hodnotenie nastala chyba Skúste to znova neskôr.",
  },
}

export default slovakLabels
