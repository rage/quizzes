import { SingleLanguageLabels } from "./index"

const croatianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Primjer odgovora",
    userAnswerLabel: "Vaš odgovor",
    currentNumberOfWordsLabel: "Broj riječi",
    textFieldLabel: "Vaš odgovor",
    conformToLimitsToSubmitLabel:
      "Da biste ga mogli poslati, vaš odgovor mora biti u okviru navedenog broja riječi.",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Odgovor mora imati manje od ${max} riječi.`
      }

      if (!max) {
        return `Odgovor mora imati više od ${min} riječi.`
      }

      return `Odgovor mora imati između ${min} i ${max} riječi.`
    },
  },
  open: {
    placeholder: "Odgovor",
    userAnswerLabel: "Vaš odgovor",
    feedbackForFailure: "Vaš odgovor nije točan.",
    feedbackForSuccess: "Vaš odgovor je točan.",
  },
  peerReviews: {
    loadingLabel: "Učitavanje",
    noPeerAnswersAvailableLabel: "Nema odgovorâ drugih polaznika za ocjenjivanje.",
    chooseButtonLabel: "Odaberi",
    unselectButtonLabel: "Poništi odabir",
    chooseEssayInstruction: "Odaberite odgovor koji ćete ocijeniti.",
    chosenEssayInstruction: "Ocijenite odgovor koji ste odabrali.",
    displayPeerReview: "Ocijeni odgovore drugih polaznika",
    giveExtraPeerReviews:
      "Ocijenili ste potreban broj odgovora drugih polaznika. Što više odgovora drugih polaznika ocijenite, to brže će vaši odgovori doći na red za ocjenjivanje!",
    giveExtraPeerReviewsQuizConfirmed:
      "I dalje možete ocjenjivati odgovore drugih polaznika kako biste im pomogli.",
    givenPeerReviewsLabel: "Ocjene dane drugim polaznicima",
    peerReviewsCompletedInfo: "Ocijenili ste dovoljan broj odgovora.",
    reportAsInappropriateLabel: "Prijavi neprimjeren sadržaj",
    submitPeerReviewLabel: "Pošalji ocjenu",
    hidePeerReviewLabel: "Sakrij",
    essayQuestionAnswerTextBoxLabel: "Ocijenite odgovor",
    optionLabel: "Odgovor",
    answerRejected: "Vaš odgovor je odbijen.",
    answerFlaggedAsSpam: "Vaš odgovor je prijavljen kao neprimjeren.",
    answerConfirmed: "Vaš odgovor je prihvaćen!",
    manualReview: "Vaš odgovor pregledava član nastavnog osoblja.",
    peerReviewGroupTitle: "Međusobno ocjenjivanje",
    peerReviewLikertDetails:
      "Procijenite svaku tvrdnju na skali od 1-5. 1 se čvrsto ne slažem i 5 se čvrsto ne slažem.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Došlo je do pogreške pri prikazu ocjena dobivenih od drugih polaznika. Pokušajte ponovno učitati stranicu.",
    noSupportForQuestionTypeLabel:
      "Međusobno ocjenjivanje za tu vrstu odgovora nije podržano.",
    loadingLabel: "Učitavanje ocjena dobivenih od drugih polaznika...",
    noPeerReviewsReceivedlabel:
      "Drugi polaznici još nisu ocijenili vaš odgovor.",
    numberOfPeerReviewsText: n =>
      `Broj ocjena dodijeljenih vašem odgovoru: ${n}.`,
    toggleButtonExpandLabel: "Prikaži sve ocjene dobivene od drugih polaznika",
    toggleButtonShrinkLabel: "Sakrij ocjene dobivene od drugih polaznika",
    averageOfGradesLabel: "Prosjek dobivenih ocjena:",
    detailedViewLabel: "Sve ocjene dodijeljene vašem odgovoru",
    summaryViewLabel: "Ocjene dobivene od drugih polaznika",
    peerReviewLabel: "Međusobno ocjenjivanje",
    peerReviewReceived: "Dobili ste novu ocjenu od drugog polaznika.",
    peerReviewReceivedFor: (title: string) =>
      `Dobili ste novu ocjenu od drugog polaznika za zadatak ${title}.`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Ta vrsta odgovora '${itemType}' nije podržana.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Označite točan odgovor",
    chooseAllSuitableOptionsLabel: "Označite sve moguće odgovore.",
    answerCorrectLabel: "Točno.",
    answerIncorrectLabel: "Netočno.",
  },
  stage: {
    answerStageLabel: "U tijeku je rješavanje zadatka",
    givingPeerReviewsStageLabel: "U tijeku je ocjenjivanje odgovorâ drugih polaznika",
    receivingPeerReviewsStageLabel: "U tijeku je primanje ocjena od drugih polaznika",
    evaluationStageLabel: "Čeka se ocjena nastavnog osoblja",
  },
  general: {
    pastDeadline: "Na taj zadatak više nije moguće odgovoriti.",
    answerMissingBecauseQuizModifiedLabel:
      "Neodgovoreno pitanje. Test je vjerojatno izmijenjen nakon što ste unijeli odgovor.",
    submitButtonLabel: "Pošalji",
    errorLabel: "Pogreška",
    loginToViewPromptLabel: "Prijavite se za prikaz zadatka",
    loginToAnswerPromptLabel: "Prijavite se za unos odgovora",
    loadingLabel: "Učitavanje",
    answerCorrectLabel: "Odgovor je točan.",
    alreadyAnsweredLabel: "Na to ste pitanje već odgovorili.",
    answerIncorrectLabel: "Odgovor nije točan.",
    kOutOfNCorrect: (k, n) => `Točni odgovori: ${k}/${n}`,
    pointsAvailableLabel: "Mogući bodovi za taj zadatak",
    pointsReceivedLabel: "Dodijeljeni bodovi",
    incorrectSubmitWhileTriesLeftLabel:
      "Odgovor nije u potpunosti točan. Pokušajte ponovno!",
    triesRemainingLabel: "Preostali pokušaji",
    quizLabel: "Test",
    pointsLabel: "Broj bodova",
    triesNotLimitedLabel: "Broj pokušaja nije ograničen.",
    submitGeneralFeedbackLabel: "Poslano",
    submitButtonAlreadyAnsweredLabel: "Odgovoreno",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Odgovor mora biti potpuno točan da bi se za njega dodijelili bodovi."
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Odgovoreno",
    unanswered: "Neodgovoren",
    rejected: "Vaš odgovor je odbijen, pokušajte ponovno",
    progressUpdated: "Pregled napretka je ažuriran.",
    answerConfirmed: "Vaš odgovor je potvrđen!",
    answerConfirmedFor: (title: string) =>
      `Vaš odgovor na zadatak ${title} je potvrđen!`,
    courseCompleted: "Završili ste tečaj!",
  },
  error: {
    submitFailedError:
      "Slanje odgovora nije uspjelo. Pokušajte ponovno poslije.",
    quizLoadFailedError: "Učitavanje zadatka nije uspjelo.",
    progressFetchError:
      "Dohvaćanje podataka o napretku nije uspjelo. Pokušajte ponovno poslije.",
    submitSpamFlagError:
      "Prijava neprimjerenog sadržaja nije uspjela.",
    fetchReviewCandidatesError:
      "Došlo je do pogreške pri učitavanju odgovorâ za ocjenjivanje. Pokušajte ponovno poslije.",
  },
}

export default croatianLabels
