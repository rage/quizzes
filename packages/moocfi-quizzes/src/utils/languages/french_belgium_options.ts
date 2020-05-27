import { SingleLanguageLabels } from "./index"

const frenchBelgiumLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Exemple de réponse",
    userAnswerLabel: "Votre réponse",
    currentNumberOfWordsLabel: "Mots",
    textFieldLabel: "Votre réponse",
    conformToLimitsToSubmitLabel:
      "Modifiez votre réponse en respectant les limites de mots pour la soumettre",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `Votre réponse ne doit pas dépasser ${max} mots`
      }

      if (!max) {
        return `Votre réponse devra être composée de ${min} mots au minimum.`
      }

      return `Votre réponse doit être composée d'entre ${min} et ${max} mots`
    },
  },
  open: {
    placeholder: "Réponse",
    userAnswerLabel: "Votre réponse",
    feedbackForFailure: "Votre réponse est correcte",
    feedbackForSuccess: "Votre réponse est incorrecte",
  },
  peerReviews: {
    loadingLabel: "Chargement en cours",
    noPeerAnswersAvailableLabel:
      "Aucune réponse disponible pour une évaluation par les pairs",
    chooseButtonLabel: "Sélectionner",
    unselectButtonLabel: "Désélectionner",
    chooseEssayInstruction:
      "Choisissez un des essais pour l'évaluation par les pairs",
    chosenEssayInstruction: "Revoir la réponse choisie:",
    displayPeerReview: "Donner une évaluation par les pairs",
    giveExtraPeerReviews:
      "Vous avez donné le nombre requis d'évaluations par les pairs. En donnant plus d'évaluations par les pairs, votre réponse sera examinée plus rapidement !",
    giveExtraPeerReviewsQuizConfirmed:
      "Vous pouvez continuer à donner des évaluations par les pairs pour aider les autres",
    givenPeerReviewsLabel: "évaluations par les pairs données",
    peerReviewsCompletedInfo:
      "Vous avez effectué les évaluations par les pairs requises",
    reportAsInappropriateLabel: "Signaler comme inappropriée",
    submitPeerReviewLabel: "Soumettre une évaluation",
    hidePeerReviewLabel: "Cacher",
    essayQuestionAnswerTextBoxLabel: "Rédiger une évaluation",
    optionLabel: "Option",
    answerRejected: "Votre réponse a été refusée",
    answerFlaggedAsSpam: "Votre réponse a été refusée car jugée inappropriée.",
    answerConfirmed: "Votre réponse a été confirmée !",
    manualReview:
      "Votre réponse est en cours d'examen par le personnel du cours",
    peerReviewGroupTitle: "Vertaisarviointikysymykset",
    peerReviewLikertDetails:
      "Arvioi jokainen väite asteikolla 1-5. 1 on vahvasti eri mieltä ja 5 on vahvasti samaa mieltä.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Une erreur s'est produite dans l'affichage des évaluations par les pairs que vous avez reçues. Le rechargement de la page pourrait vous aider.",
    noSupportForQuestionTypeLabel:
      "Ce type de question d'évaluation par les pairs n'est pas accepté.",
    loadingLabel: "Chargement des évaluations par les pairs reçues en cours...",
    noPeerReviewsReceivedlabel:
      "Votre réponse n'a pas encore fait l'objet d'une évaluation par les pairs",
    numberOfPeerReviewsText: n =>
      `Votre réponse a fait l'objet de ${n} évaluation${
        n > 0 ? "s" : ""
      } par les pairs..`,
    toggleButtonExpandLabel:
      "Afficher toutes les évaluations par les pairs reçues",
    toggleButtonShrinkLabel: "Cacher les évaluations par les pairs",
    averageOfGradesLabel: "La note moyenne des avis reçus est de",
    detailedViewLabel: "Toutes les évaluations que votre réponse a reçues",
    summaryViewLabel: "Les évaluations par les pairs reçues:",
    peerReviewLabel: "Évaluation par les pairs",
    peerReviewReceived: "Vous avez reçu un nouvel examen par les pairs",
    peerReviewReceivedFor: (title: string) =>
      `Vous avez reçu un nouvel examen par les pairs pour l'exercice ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Une question de type '${itemType}' n'est pas acceptée.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Sélectionnez la bonne réponse",
    chooseAllSuitableOptionsLabel:
      "Sélectionnez toutes les options appropriées",
    answerCorrectLabel: "Correcte",
    answerIncorrectLabel: "Incorrecte",
  },
  stage: {
    answerStageLabel: "Répondre au quiz",
    givingPeerReviewsStageLabel: "Donner une évaluations par les pairs",
    receivingPeerReviewsStageLabel: "Recevoir des évaluations par les pairs",
    evaluationStageLabel: "Évaluer la réponse",
  },
  general: {
    pastDeadline: "Vous ne pouvez plus soumettre de réponse.",
    answerMissingBecauseQuizModifiedLabel:
      "Question sans réponse. Le quiz a probablement été modifié après votre réponse.",
    submitButtonLabel: "Répondre",
    errorLabel: "Une erreur s'est produite",
    loginToViewPromptLabel: "Connectez-vous pour voir le quiz",
    loginToAnswerPromptLabel: "Connectez-vous pour répondre au quiz",
    loadingLabel: "Chargement en cours",
    answerCorrectLabel: "La réponse est correcten",
    alreadyAnsweredLabel: "Vous avez déjà répondu",
    answerIncorrectLabel: "La réponse est incorrecte",
    kOutOfNCorrect: (k, n) => `Vous avez ${k}/${n} réponses correctes`,
    pointsAvailableLabel: "Points disponibles dans le quiz",
    pointsReceivedLabel: "Points qui vous sont accordés",
    incorrectSubmitWhileTriesLeftLabel:
      "La réponse n'était pas tout à fait correcte - vous pouvez réessayer !",
    triesRemainingLabel: "Tentatives restantes",
    quizLabel: "Quiz",
    pointsLabel: "Points",
    triesNotLimitedLabel: "Le nombre de tentatives est illimité",
    submitGeneralFeedbackLabel: "Réponse soumise",
    submitButtonAlreadyAnsweredLabel: "Réponse reçue",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Pour pouvoir obtenir des points, la réponse doit être entièrement correcte "
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Répondue",
    unanswered: "Sans réponse",
    rejected: "Réponse refusée, réessayez",
    progressUpdated: "Progression du cours mise à jour",
    answerConfirmed: "Votre réponse a été confirmée!",
    answerConfirmedFor: (title: string) =>
      `Votre réponse à l'exercice ${title} a été confirmée!`,
    courseCompleted: "Vous avez terminé le cours!",
  },
  error: {
    submitFailedError:
      "Impossible d'envoyer votre réponse. Veuillez réessayer plus tard.",
    quizLoadFailedError: "Impossible de charger l'exercice",
    progressFetchError:
      "Impossible de récupérer les données de progression du cours. Veuillez réessayer plus tard.",
    submitSpamFlagError: "Impossible de signaler le spam",
    fetchReviewCandidatesError:
      "Une erreur s'est produite lors de la récupération des réponses pour examen par les pairs. Veuillez réessayer plus tard.",
  },
}

export default frenchBelgiumLabels
