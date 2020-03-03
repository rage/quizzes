import { SingleLanguageLabels } from "./index"

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Näidisvastus",
    userAnswerLabel: "Teie vastus",
    currentNumberOfWordsLabel: "Sõnade arv",
    textFieldLabel: "Teie vastus",
    conformToLimitsToSubmitLabel:
      "Muokkaa vastauksesi sanarajojen sisään voidaksesi lähettää sen",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Vastaa korkeintaan ${max} sanalla`
      }

      if (!max) {
        return `Vastaa vähintään ${min} sanalla`
      }

      return `Vastaa ${min}-${max} sanalla`
    },
  },
  open: {
    placeholder: "Vastus",
    userAnswerLabel: "Teie vastus",
    feedbackForFailure: "Vastauksesi ei ole oikein",
    feedbackForSuccess: "Vastauksesi on oikein",
  },
  peerReviews: {
    loadingLabel: "Laen",
    noPeerAnswersAvailableLabel: "Vertaisarvioitavia vastauksia ei saatavilla",
    chooseButtonLabel: "Vali",
    unselectButtonLabel: "Peru valinta",
    chooseEssayInstruction: "Valitse yksi vaihtoehdoista arvoitavaksi",
    chosenEssayInstruction: "Arvioi valitsemasi vastaus:",
    displayPeerReview: "Anna vertaisarvio",
    giveExtraPeerReviews:
      "Olet antanut vaaditun määrän vertaisarvioita. Jos annat vielä lisää vertaisarvioita, oma vastauksesi tulee nopeammin arvioiduksi!",
    giveExtraPeerReviewsQuizConfirmed:
      "Voit halutessasi vielä antaa lisää vertaisarvioita",
    givenPeerReviewsLabel: "Vertaisarvioita annettu",
    peerReviewsCompletedInfo: "Olet antanut tarpeeksi monta vertaisarviota",
    reportAsInappropriateLabel: "Teata spämmist",
    submitPeerReviewLabel: "Lähetä vertaisarvio",
    hidePeerReviewLabel: "Piilota",
    quizInvolvesNoPeerReviewsInstruction:
      "Tähän tehtävään ei liity vertaisarvioita",
    peerReviewsInfoForLoggedOutUser: "Kyselyyn liittyy vertaisarviointiosio",
    essayQuestionAnswerTextBoxLabel: "Kirjoita arvio",
    optionLabel: "Optsioon",
    answerRejected: "Vastauksesi on hylätty",
    answerFlaggedAsSpam: "Vastauksesi on hylätty epäasiallisena",
    answerConfirmed: "Vastaus hyväksytty!",
    manualReview: "Vastauksesi odottaa kurssihenkilökunnan arviota",
  },
  receivedPeerReviews: {
    errorLabel:
      "Virhe saatujen vertaisarviontien näyttämisessä. Kokeile ladata sivu uudelleen.",
    noSupportForQuestionTypeLabel:
      "Tämänlaista vertaisarviointikysymyksen tyyppiä ei tueta",
    loadingLabel: "Ladataan saamiasi vertaisarvioita...",
    noPeerReviewsReceivedlabel:
      "Vastauksesi ei ole vielä saanut vertaisarvioita",
    numberOfPeerReviewsText: n =>
      `Vastauksesi on saanut ${n} arvio${n > 0 ? "ta" : "n"}.`,
    toggleButtonExpandLabel: "Näytä kaikki saamasi vertaisarviot",
    toggleButtonShrinkLabel: "Piilota saamasi vertaisarviot",
    averageOfGradesLabel: "Kaikkien arvosteluiden keskiarvo on",
    detailedViewLabel: "Kaikki vastauksesi saamat vertaisarviot",
    summaryViewLabel: "Saamasi vertaisarviot:",
    peerReviewLabel: "Vertaisarvio",
    peerReviewReceived: "Olet saanut uuden vertaisarvion",
    peerReviewReceivedFor: (title: string) =>
      `Olet saanut uuden vertaisarvion tehtävässä ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Kysymystyyppiä'${itemType}' ei tueta.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Valitse oikea vaihtoehto",
    chooseAllSuitableOptionsLabel: "Valitse kaikki sopivat vaihtoehdot.",
    answerCorrectLabel: "Õige",
    answerIncorrectLabel: "Vale",
  },
  stage: {
    answerStageLabel: "Tehtävään vastaaminen",
    givingPeerReviewsStageLabel: "Vertaisarvioiden antaminen",
    receivingPeerReviewsStageLabel: "Vertaisarvioiden vastaanottaminen",
    evaluationStageLabel: "Odottaa arvostelua",
  },
  general: {
    pastDeadline: "Et voi vastata enää tähän tehtävään",
    answerMissingBecauseQuizModifiedLabel:
      "Kysymykseen ei vastattu. Tehtävää todennäköisesti muutettu vastaamisen jälkeen.",
    submitButtonLabel: "Esita",
    errorLabel: "Virhe",
    loginToViewPromptLabel: "Kirjaudu sisään nähdäksesi tehtävän",
    loginToAnswerPromptLabel: "Kirjaudu sisään vastataksesi tehtävään",
    loadingLabel: "Laen",
    answerCorrectLabel: "Vastaus oikein",
    alreadyAnsweredLabel: "Olet jo vastannut tähän",
    answerIncorrectLabel: "Vastaus väärin",
    kOutOfNCorrect: (k, n) => `Sait ${k}/${n} oikein`,
    pointsAvailableLabel: "Pisteitä saatavissa",
    pointsReceivedLabel: "Saamasi pisteet",
    incorrectSubmitWhileTriesLeftLabel:
      "Vastauksesi ei ollut täysin oikein. Ole hyvä ja yritä uudestaan!",
    triesRemainingLabel: "Yrityksiä jäljellä",
    quizLabel: "Kysely",
    pointsLabel: "Pisteitä",
    triesNotLimitedLabel: "Yritysten lukumäärää ei rajattu",
    submitGeneralFeedbackLabel: "Vastattu",
    submitButtonAlreadyAnsweredLabel: "Vastattu",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Vastauksen on oltava täysin oikein saadaksesi pisteitä"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    // These three are in elements of ai messages
    answered: "Vastattu",
    unanswered: "Vastaamaton",
    rejected: "Vastaus hylätty, yritä uudelleen",
    progressUpdated: "Kurssipisteesi ovat päivittyneet",
    answerConfirmed: "Vastauksesi on hyväksytty",
    answerConfirmedFor: (title: string) =>
      `Vastauksesi tehtävään ${title} on hyväksytty`,
    courseCompleted: "Olet päässyt läpi kurssista!",
  },
  error: {
    submitFailedError:
      "Vastauksen lähettäminen ei onnistunut. Kokeile myöhemmin uudestaan.",
    quizLoadFailedError: "Tehtävän lataaminen ei onnistunut",
    progressFetchError:
      "Suoritustietojen lataaminen ei onnistunut. Kokeile myöhemmin uudestaan",
    submitSpamFlagError:
      "Asiattomasta vastauksesta ilmoittaminen ei onnistunut",
    fetchReviewCandidatesError:
      "Vastausten lataaminen vertaisarviota varten ei onnistunut. Kokeile myöhemmin uudestaan.",
  },
}

export default finnishLabels
