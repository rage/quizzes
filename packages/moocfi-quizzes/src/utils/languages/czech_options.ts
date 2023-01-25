import { SingleLanguageLabels } from "./index"

const czechLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Příklad odpovědi",
    userAnswerLabel: "Vaše odpověď",
    currentNumberOfWordsLabel: "Počet slov",
    textFieldLabel: "Vaše odpověď",
    conformToLimitsToSubmitLabel:
      "To be able to submit the answer, make sure it conforms to the word limitsAbyste bylo možné odpověď odeslat, ujistěte se, že nepřekračuje maximální možný počet slov",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Vaše odpověď by neměla být delší než ${max} slov`
      }

      if (!max) {
        return `Vaše odpověď by měla mít alespoň ${min} slov`
      }
      return `Vaše odpověď by měla mít ${min} až ${max} slov`
    },
  },
  open: {
    placeholder: "Odpověď",
    userAnswerLabel: "Vaše odpověď",
    feedbackForSuccess: "Vaše odpověď je správná",
    feedbackForFailure: "Vaše odpověď není správná",
  },
  peerReviews: {
    loadingLabel: "Načítá se",
    chooseButtonLabel: "Vybrat",
    unselectButtonLabel: "Zrušit výběr",
    chooseEssayInstruction: "Vybrat jednu odpověď k hodnocení",
    chosenEssayInstruction: "Ohodnotit vybranou odpověď",
    givenPeerReviewsLabel: "Ohodnocené odpovědi",
    noPeerAnswersAvailableLabel:
      "Nejsou k dispozici žádné odpovědi k hodnocení",
    reportAsInappropriateLabel: "Nahlásit jako spam",
    submitPeerReviewLabel: "Odeslat hodnocení",
    peerReviewsCompletedInfo: "Ohodnotil/a jste dostatečný počet odpovědí",
    giveExtraPeerReviews:
      "Ohodnotil/a jste požadovaný počet odpovědí. Pokud ohodnotíte více odpovědí, bude vaše odpověď ohodnocena rychleji!",
    giveExtraPeerReviewsQuizConfirmed:
      "Můžete ohodnotit ještě další odpovědi, a pomoci tak ostatním",
    displayPeerReview: "Ohodnotit",
    hidePeerReviewLabel: "Skrýt",
    essayQuestionAnswerTextBoxLabel: "Napsat hodnocení",
    optionLabel: "Možnost",
    answerRejected: "Vaše odpověď byla odmítnuta",
    answerFlaggedAsSpam: "Vaše odpověď byla nahlášena jako spam",
    answerConfirmed: "Vaše odpověď byla přijata!",
    manualReview: "Vaši odpověď nyní hodnotí lektoři kurzu",
    peerReviewGroupTitle: "Peer review questions",
    peerReviewLikertDetails:
      "Evaluate each statement on a scale of 1-5. 1 means strongly disagree, 5 means strongly agree.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "Průměrná známka obdržených hodnocení je",
    detailedViewLabel: "Všechna hodnocení vaší odpovědi",
    errorLabel:
      "Při zobrazování obdržených hodnocení došlo k chybě. Zkuste stránku znovu načíst.",
    loadingLabel: "Načítá se...",
    noPeerReviewsReceivedlabel: "Vaši odpověď zatím nikdo neohodnotil",
    noSupportForQuestionTypeLabel: "Tento typ hodnocení není podporován",
    numberOfPeerReviewsText: n => `Vaše odpověď má ${n} hodnocení.`,
    summaryViewLabel: "Obdržená hodnocení:",
    toggleButtonExpandLabel: "Zobrazit všechna obdržená hodnocení",
    toggleButtonShrinkLabel: "Skrýt hodnocení",
    peerReviewLabel: "Hodnocení",
    peerReviewReceived: "Obdržel/a jste nové hodnocení",
    peerReviewReceivedFor: (title: string) =>
      `Obdržel/a jste nové hodnocení k úkolu  ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Odpověď typu ${itemType} není podporována.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Vybrat správnou odpověď",
    chooseAllSuitableOptionsLabel: "Vybrat všechny vhodné možnosti",
    answerCorrectLabel: "Správně",
    answerIncorrectLabel: "Špatně",
    selectOption: "select an option",
  },
  stage: {
    answerStageLabel: "Plnění úkolu",
    givingPeerReviewsStageLabel: "Hodnocení odpovědí ostatních",
    receivingPeerReviewsStageLabel: "Získávání hodnocení od ostatních",
    evaluationStageLabel: "Čekání na oznámkování",
  },
  general: {
    pastDeadline: "Na tento úkol již nelze odpovídat",
    answerMissingBecauseQuizModifiedLabel:
      "Otázka nebyla zodpovězena. Úkol byl pravděpodobně změněn poté, co jste jej zodpověděl/a.",
    submitButtonLabel: "Odeslat",
    errorLabel: "Chyba",
    loginToViewPromptLabel: "Pro zobrazení úkolu se přihlaste",
    loginToAnswerPromptLabel: "Pro zobrazení úkolu se přihlaste",
    loadingLabel: "Načítá se",
    answerCorrectLabel: "Správná odpověď",
    alreadyAnsweredLabel: "Na tuto otázku jste již odpověděl/a",
    answerIncorrectLabel: "Špatná odpověď",
    kOutOfNCorrect: (k, n) => `Počet správných odpovědí je ${k} z(e) ${n}`,
    pointsAvailableLabel: "Počet bodů, které je možné za tento úkol získat",
    pointsReceivedLabel: "Získané body",
    incorrectSubmitWhileTriesLeftLabel:
      "Odpověď nebyla zcela správná. Zkuste to prosím znovu.",
    triesRemainingLabel: "Zbývající počet pokusů",
    quizLabel: "Úkol",
    pointsLabel: "Body",
    triesNotLimitedLabel: "Počet pokusů není omezen",
    submitGeneralFeedbackLabel: "Odesláno",
    submitButtonAlreadyAnsweredLabel: "Zodpovězeno",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Pro obdržení bodů musí být odpověď zcela správná"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Zodpovězeno",
    unanswered: "Nezodpovězeno",
    rejected: "Odmítnutá odpověď, zkuste to znovu",
    progressUpdated: "Pokrok v kurzu byl aktualizován.",
    answerConfirmed: "Vaše odpověď byla potvrzena!",
    answerConfirmedFor: (title: string) =>
      `Vaše odpověď k úkolu  ${title} byla potvrzena!`,
    courseCompleted: "Dokončil/a jste tento kurz!",
  },
  error: {
    submitFailedError:
      "Vaši odpověď se nepodařilo odeslat. Zkuste to prosím znovu později.",
    quizLoadFailedError: "Úkol se nepodařilo načíst",
    progressFetchError:
      "Nepodařilo se získat údaje o pokroku v kurzu. Zkuste to prosím znovu později.",
    submitSpamFlagError: "Nepodařilo se nahlásit spam.",
    fetchReviewCandidatesError:
      "Při načítání odpovědí k hodnocení došlo k chybě. Zkuste to prosím znovu později.",
  },
}

export default czechLabels
