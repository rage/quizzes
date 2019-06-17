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
        peerReviewsCompletedInfo: "Tarvittavat vertaisarviot annettu",
        minimumWords: "Sanoja vähintään",
        extraPeerReviewsEncouragement:
          "Olet jo antanut tarvittavan määrän vertaisarvioita. \
         Jatka muiden töiden arviointia painamalla alhaalta - \
          -  näin parannat oman vastauksesi todennäköisyyttä tulla vertaisarvioiduksi!",
        displayPeerReview: "Tee vertaisarvio",
        hidePeerReview: "Piilota",
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
        peerReviewsCompletedInfo: "All peer reviews have been submitted",
        minimumWords: "Minimum number of words",
        extraPeerReviewsEncouragement:
          "You have reviewed the minimum number of peer essays. You may continue to \
        review your peers' works, thereby increasing the probability of your own answer being selected by others!",
        displayPeerReview: "Add peer review",
        hidePeerReview: "Hide",
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
