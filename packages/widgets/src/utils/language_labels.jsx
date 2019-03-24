export default (languageId, quizItemType) => {
  const languageOptions = {
    fi_FI: {
      essay: {
        choosePeerEssayLabel: "Valitse",
        exampleAnswerLabel: "Esimerkkivastaus",
        givenPeerReviewsLabel: "Vertaisarvioita annettu",
        loadingLabel: "Ladataan",
        noPeerAnswersAvailableLabel:
          "Vertaisarvioitavia vastauksia ei saatavilla",
        reportAsInappropriateLabel: "Ilmoita asiaton vastaus",
        submitPeerReviewLabel: "Lähetä vertaisarvio",
        userAnswerLabel: "Vastauksesi",
      },
      open: {
        placeholder: "Vastaus",
        userAnswerLabel: "Vastauksesi",
      },
    },
    en_US: {
      essay: {
        choosePeerEssayLabel: "Choose",
        exampleAnswerLabel: "Answer example",
        givenPeerReviewsLabel: "Peer reviews given",
        loadingLabel: "Loading",
        noPeerAnswersAvailableLabel: "No answers available for peer review",
        reportAsInappropriateLabel: "Report as inappropriate",
        submitPeerReviewLabel: "Submit review",
        userAnswerLabel: "Your answer",
      },
      open: {
        placeholder: "Answer",
        userAnswerLabel: "Your answer",
      },
    },
  }

  const correctLabels = languageOptions[languageId]
  return correctLabels
    ? correctLabels[quizItemType]
    : languageOptions.en_US[quizItemType]
}
