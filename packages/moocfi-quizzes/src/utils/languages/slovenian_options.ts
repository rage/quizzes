import { SingleLanguageLabels } from "./index"

const slovenianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Primer odgovora",
    userAnswerLabel: "Vaš odgovor",
    currentNumberOfWordsLabel: "besed",
    textFieldLabel: "Vaš odgovor",
    conformToLimitsToSubmitLabel:
      "Preden pošljete odgovor, preverite, da je število besed v okviru omejitev",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Vaš odgovor ne sme biti daljši od ${max} besed`
      }

      if (!max) {
        return `Vaš odgovor mora imeti vsaj ${min} besed`
      }
      return `Vaš odgovor mora imeti med ${min} in ${max} besed`
    },
  },
  open: {
    placeholder: "Odgovor",
    userAnswerLabel: "Vaš odgovor",
    feedbackForSuccess: "Vaš odgovor je pravilen",
    feedbackForFailure: "Vaš odgovor ni pravilen",
  },
  peerReviews: {
    loadingLabel: "Nalaganje",
    chooseButtonLabel: "Izberi",
    unselectButtonLabel: "Prekliči izbiro",
    chooseEssayInstruction: "Izberite eno možnost za pregled",
    chosenEssayInstruction: "Preglejte odgovor, ki ste ga izbrali",
    givenPeerReviewsLabel: "Oddani medsebojni pregledi",
    noPeerAnswersAvailableLabel: "Ni odgovorov za medsebojni pregled",
    reportAsInappropriateLabel: "Prijavite kot neželeno vsebino",
    submitPeerReviewLabel: "Pošljite pregled",
    peerReviewsCompletedInfo: "Oddali ste dovolj medsebojnih pregledov",
    giveExtraPeerReviews:
      "Oddali ste potrebno število medsebojnih pregledov. Če oddate več medsebojnih pregledov, bo vaš odgovor pregledan hitreje!",
    giveExtraPeerReviewsQuizConfirmed:
      "Še vedno lahko oddate medsebojne preglede v pomoč drugim",
    displayPeerReview: "Oddajte medsebojni pregled",
    hidePeerReviewLabel: "Skrij",
    essayQuestionAnswerTextBoxLabel: "Napišite pregled",
    optionLabel: "Odgovor",
    answerRejected: "Vaš odgovor je zavrnjen",
    answerFlaggedAsSpam: "Vaš odgovor je bil prijavljen kot neželena vsebina",
    answerConfirmed: "Vaš odgovor je sprejet.",
    manualReview: "Osebje tečaja pregleduje vaš odgovor",
    peerReviewGroupTitle: "Vprašanja, ki so del medvrstniškega vrednotenja",
    peerReviewLikertDetails:
      "Ovrednotite vsako trditev na lestvici od 1 do 5. 1 pomeni se nikakor ne strinjam, 5 pomeni se popolnoma strinjam.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "Povprečna ocena prejetih pregledov jeis",
    detailedViewLabel: "Vsi pregledi, ki jih je vaš odgovor prejel",
    errorLabel:
      "Pri prikazu prejetih medsebojnih pregledov je prišlo do napake. Poskusite stran ponovno naložiti.",
    loadingLabel: "Nalaganje prejetih medsebojnih pregledov...",
    noPeerReviewsReceivedlabel:
      "Vaš odgovor še ni prejel medsebojnih pregledov",
    noSupportForQuestionTypeLabel: "Tovrsten medsebojni pregled ni podprt",
    numberOfPeerReviewsText: n =>
      `Vaš odgovor je prejel ${n} medsebojnih pregledov/pregledov.`,
    summaryViewLabel: "Prejeti medsebojni pregledi:",
    toggleButtonExpandLabel: "Prikaži vse prejete medsebojne preglede",
    toggleButtonShrinkLabel: "Skrij",
    peerReviewLabel: "Medsebojni pregled",
    peerReviewReceived: "Prejeli ste novo medvrstniško ovrednotenje",
    peerReviewReceivedFor: (title: string) =>
      `Prejeli ste nov medsebojni pregled za nalogo ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Izberite pravilni odgovorPregled vrste '${itemType}' ni podprt.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Izberite pravilni odgovor",
    chooseAllSuitableOptionsLabel: "Izberite vse relevantne možnosti",
    answerCorrectLabel: "Pravilno",
    answerIncorrectLabel: "Napačno",
  },
  stage: {
    answerStageLabel: "Izpolnjevanje naloge",
    givingPeerReviewsStageLabel: "Oddaja medsebojnih pregledov",
    receivingPeerReviewsStageLabel: "Prejemanje medsebojnih pregledov",
    evaluationStageLabel: "Čakanje na oceno",
  },
  general: {
    pastDeadline: "Na vprašanje iz te naloge ne morete več odgovoriti",
    answerMissingBecauseQuizModifiedLabel:
      "Vprašanje ni odgovorjeno. Kviz je bil verjetno po vašem odgovoru spremenjen.",
    submitButtonLabel: "Pošlji",
    errorLabel: "Napaka",
    loginToViewPromptLabel: "Za ogled naloge se prijavite",
    loginToAnswerPromptLabel: "Za izpolnitev naloge se prijavite",
    loadingLabel: "Nalaganje",
    answerCorrectLabel: "Odgovor je pravilen",
    alreadyAnsweredLabel: "Na to vprašanje ste že odgovorili",
    answerIncorrectLabel: "Odgovor ni pravilen",
    kOutOfNCorrect: (k, n) => `${k}/${n} pravilnih odgovorov`,
    pointsAvailableLabel: "Točke na voljo za to nalogo",
    pointsReceivedLabel: "Prejete točke",
    incorrectSubmitWhileTriesLeftLabel:
      "Odgovor ni bil povsem pravilen. Poskusite znova.",
    triesRemainingLabel: "Število preostalih poskusov",
    quizLabel: "Kviz",
    pointsLabel: "Točke",
    triesNotLimitedLabel: "Število poskusov ni omejeno",
    submitGeneralFeedbackLabel: "Poslano",
    submitButtonAlreadyAnsweredLabel: "Odgovorjeno",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Za prejem točk mora biti odgovor popolnoma pravilen"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Odgovorjeno",
    unanswered: "Neodgovorjen",
    rejected: "Zavrnjen odgovor, poskusite ponovno",
    progressUpdated: "Vaš napredek v tečaju je posodobljen",
    answerConfirmed: "Vaš odgovor je bil sprejet!",
    answerConfirmedFor: (title: string) =>
      `Vaš odgovor pri nalogi ${title} je bil sprejet!`,
    courseCompleted: "Uspešno ste zaključili s tečajem!",
  },
  error: {
    submitFailedError: "Vaš odgovor ni bil poslan. Prosimo, poskusite pozneje.",
    quizLoadFailedError: "Nalaganje naloge ni bilo uspešno",
    progressFetchError:
      "Neuspešno pridobivanje podatkov o napredku v tečaju. Prosimo, poskusite ponovno pozneje. ",
    submitSpamFlagError: "Neuspešna prijava neprimerne vsebine.",
    fetchReviewCandidatesError:
      "Prišlo je do napake pri pridobivanju odgovorov za medvrstniško vrednotenje. Prosimo, poskusite ponovno pozneje.",
  },
}

export default slovenianLabels
