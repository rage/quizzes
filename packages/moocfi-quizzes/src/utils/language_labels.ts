export type EssayLabels = {
  exampleAnswerLabel: string
  userAnswerLabel: string
  minimumWords: string
}

export type PeerReviewLabels = {
  noPeerAnswersAvailableLabel: string
  choosePeerEssayLabel: string
  displayPeerReview: string
  extraPeerReviewsEncouragementLabel: string
  givenPeerReviewsLabel: string
  peerReviewsCompletedInfo: string
  reportAsInappropriateLabel: string
  submitPeerReviewLabel: string
  hidePeerReviewLabel: string
  loadingLabel: string
}

export type UnsupportedLabels = {
  notSupportedInsert: (itemType: string) => string
}

export type OpenLabels = {
  placeholder: string
  userAnswerLabel: string
}

export type SingleLanguageLabels = {
  essay: EssayLabels
  open: OpenLabels
  peerReviews: PeerReviewLabels
  unsupported: UnsupportedLabels
}

export type LanguageLabels = {
  [langugeId: string]: SingleLanguageLabels
}

const finnishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Esimerkkivastaus",
    userAnswerLabel: "Vastauksesi",
    minimumWords: "Sanoja vähintään",
  },
  open: {
    placeholder: "Vastaus",
    userAnswerLabel: "Vastauksesi",
  },
  peerReviews: {
    loadingLabel: "Ladataan",
    noPeerAnswersAvailableLabel: "Vertaisarvioitavia vastauksia ei saatavilla",
    choosePeerEssayLabel: "Valitse",
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
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Kysymystyyppiä'${itemType}' ei tueta.`,
  },
}

const englishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Answer example",
    userAnswerLabel: "Your answer",
    minimumWords: "Minimum number of words",
  },
  open: {
    placeholder: "Answer",
    userAnswerLabel: "Your answer",
  },
  peerReviews: {
    loadingLabel: "Loading",
    choosePeerEssayLabel: "Choose",
    givenPeerReviewsLabel: "Peer reviews given",
    noPeerAnswersAvailableLabel: "No answers available for peer review",
    reportAsInappropriateLabel: "Report as inappropriate",
    submitPeerReviewLabel: "Submit review",
    peerReviewsCompletedInfo: "All peer reviews have been submitted",
    extraPeerReviewsEncouragementLabel:
      "You have reviewed the minimum number of peer essays. You may continue to \
      review your peers' works, thereby increasing the probability of your own answer being selected by others!",
    displayPeerReview: "Add peer review",
    hidePeerReviewLabel: "Hide",
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Question of type '${itemType}' is not supported.`,
  },
}

export const languageOptions: LanguageLabels = {
  fi_FI: finnishLabels,
  en_US: englishLabels,
}
