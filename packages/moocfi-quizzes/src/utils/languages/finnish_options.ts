import { SingleLanguageLabels } from "./index"

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Esimerkkivastaus",
    userAnswerLabel: "Vastauksesi",
    currentNumberOfWordsLabel: "Sanoja",
    textFieldLabel: "Vastauksesi",
    conformToLimitsToSubmitLabel:
      "Muokkaa vastauksesi sanarajojen sisään lähettääksesi sen",
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
    placeholder: "Vastaus",
    userAnswerLabel: "Vastauksesi",
    feedbackForFailure: "Vastauksesi ei ole oikein",
    feedbackForSuccess: "Vastauksesi on oikein",
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
    peerReviewsInfoForLoggedOutUser: "Kyselyyn liittyy vertaisarviointiosio",
    essayQuestionAnswerTextBoxLabel: "Kirjoita arvio"
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Kysymystyyppiä'${itemType}' ei tueta.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Valitse oikea vaihtoehto",
    chooseAllSuitableOptionsLabel: "Valitse kaikki sopivat vaihtoehdot.",
    answerCorrectLabel: "Oikein",
    answerIncorrectLabel: "Väärin",
  },
  stage: {
    answerStageLabel: "Tehtävään vastaaminen",
    givingPeerReviewsStageLabel: "Vertaisarvioiden antaminen",
    receivingPeerReviewsStageLabel: "Vertaisarvioiden vastaanottaminen",
    evaluationStageLabel: "Tehtävän arvostelu",
  },
  general: {
    pastDeadline: "Et voi vastata enää tähän kyselyyn",
    answerMissingBecauseQuizModifiedLabel:
      "Kysymykseen ei vastattu. Tehtävää todennäköisesti muutettu vastaamisen jälkeen.",
    submitButtonLabel: "Vastaa",
    errorLabel: "Virhe",
    loginToViewPromptLabel: "Kirjaudu sisään nähdäksesi tehtävän",
    loginToAnswerPromptLabel: "Kirjaudu sisään vastataksesi tehtävään",
    loadingLabel: "Ladataan",
    answerCorrectLabel: "Vastaus oikein",
    alreadyAnsweredLabel: "Olet jo vastannut",
    answerIncorrectLabel: "Vastaus väärin",
    kOutOfNCorrect: (k, n) => `Sait ${k}/${n} oikein`,
    pointsAvailableLabel: "Pisteitä saatavissa",
    pointsReceivedLabel: "Saamasi pisteet",
    incorrectSubmitWhileTriesLeftLabel:
      "Vastauksesi ei ollut täysin oikein - voit yrittää uudelleen!",
    triesRemainingLabel: "Yrityksiä jäljellä",
    quizLabel: "Kysely",
    pointsLabel: "Pisteitä",
    triesNotLimitedLabel: "Yritysten lukumäärää ei rajattu",
    submitGeneralFeedbackLabel: "Vastattu",
    submitButtonAlreadyAnsweredLabel: "Vastattu",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Vastauksen oltava täysin oikein jotta pisteitä voi saada"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
  },
}

export default finnishLabels
