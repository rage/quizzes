import { SingleLanguageLabels } from "./index"

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Esimerkkivastaus",
    userAnswerLabel: "Vastauksesi",
    minimumWords: "Sanoja vähintään",
    currentNumberOfWordsLabel: "Sanoja",
    textFieldLabel: "Vastauksesi",
  },
  open: {
    placeholder: "Vastaus",
    userAnswerLabel: "Vastauksesi",
  },
  peerReviews: {
    loadingLabel: "Ladataan",
    noPeerAnswersAvailableLabel: "Vertaisarvioitavia vastauksia ei saatavilla",
    chooseButtonLabel: "Valitse",
    chooseEssayInstruction: "Valitse yksi vaihtoehdoista vertaisarvoitavaksi",
    displayPeerReview: "Tee vertaisarvio",
    extraPeerReviewsEncouragementLabel:
      "Olet jo antanut tarvittavan määrän vertaisarvioita. \
         Jatka muiden töiden arviointia painamalla alhaalta - \
          -  näin parannat oman vastauksesi todennäköisyyttä tulla vertaisarvioiduksi!",
    givenPeerReviewsLabel: "Vertaisarvioita annettu",
    peerReviewsCompletedInfo: "Tarvittavat vertaisarviot annettu",
    reportAsInappropriateLabel: "Ilmoita asiaton vastaus",
    submitPeerReviewLabel: "Lähetä vertaisarvio",
    hidePeerReviewLabel: "Piilota",
    quizInvolvesNoPeerReviewsInstruction:
      "Tähän tehtävään ei liity vertaisarvioita",
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Kysymystyyppiä'${itemType}' ei tueta.`,
  },
  multipleChoice: {
    chooseAllSuitableOptionsLabel: "Valitse kaikki sopivat vaihtoehdot.",
  },
  stage: {
    answerStageLabel: "Tehtävään vastaaminen",
    givingPeerReviewsStageLabel: "Vertaisarvioiden antaminen",
    receivingPeerReviewsStageLabel: "Vertaisarvioiden vastaanottaminen",
    evaluationStageLabel: "Tehtävän arvostelu",
  },
  general: {
    answerMissingBecauseQuizModifiedLabel:
      "Kysymykseen ei vastattu. Tehtävää todennäköisesti muutettu vastaamisen jälkeen.",
    submitButtonLabel: "Vastaa",
    errorLabel: "Virhe",
    loginPromptLabel: "Kirjaudu sisään vastataksesi tehtävään",
    loadingLabel: "Ladataan",
    answerCorrectLabel: "Tehtävä oikein",
    alreadyAnsweredLabel: "Olet jo vastannut",
    answerIncorrectLabel: "Tehtävä väärin",
    kOutOfNCorrect: (k, n) => `Sait ${k}/${n} oikein`,
    pointsAvailableLabel: "Pisteitä saatavissa",
    pointsReceivedLabel: "Saamasi pisteet",
    incorrectSubmitWhileTriesLeftLabel:
      "Vastauksesi oli virheellinen - voit yrittää uudelleen!",
  },
}

export default finnishLabels
