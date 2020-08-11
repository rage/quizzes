import { SingleLanguageLabels } from "./index"

const spanishLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Ejemplo de respuesta",
    userAnswerLabel: "Tu respuesta",
    currentNumberOfWordsLabel: "Palabras",
    textFieldLabel: "Tu respuesta",
    conformToLimitsToSubmitLabel:
      "Antes de enviar la respuesta, asegúrate de que no supera el límite de palabras.",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `La respuesta no debe exceder de ${max} palabras.`
      }

      if (!max) {
        return `La respuesta debe tener al menos ${min}  palabras.`
      }
      return `La respuesta debe tener entre ${min}  y ${max}  palabras.`
    },
  },
  open: {
    placeholder: "Respuesta",
    userAnswerLabel: "Tu respuesta",
    feedbackForSuccess: "La respuesta es correcta.",
    feedbackForFailure: "La respuesta no es correcta.",
  },
  peerReviews: {
    loadingLabel: "Cargando",
    chooseButtonLabel: "Seleccionar",
    unselectButtonLabel: "Cancelar la selección",
    chooseEssayInstruction: "Elegir una opción para revisar",
    chosenEssayInstruction: "Revisar la respuesta elegida",
    givenPeerReviewsLabel: "Revisiones de compañeros hechas",
    noPeerAnswersAvailableLabel:
      "No hay respuestas disponibles para la revisión entre compañeros",
    reportAsInappropriateLabel: "Marcar como no deseado",
    submitPeerReviewLabel: "Enviar revisión",
    peerReviewsCompletedInfo: "Has hecho suficientes revisiones de compañeros",
    giveExtraPeerReviews:
      "Has hecho el número requerido de revisiones entre compañeros. ¡Cuantas más revisiones hagas a tus compañeros, antes se revisará tu respuesta!",
    giveExtraPeerReviewsQuizConfirmed:
      "¿Te apetece seguir revisando a compañeros para ayudarles?",
    displayPeerReview: "Revisar a un compañero",
    hidePeerReviewLabel: "Ocultar",
    essayQuestionAnswerTextBoxLabel: "Escribir una revisión",
    optionLabel: "Opción",
    answerRejected: "Tu respuesta ha sido rechazada",
    answerFlaggedAsSpam: "Tu respuesta ha sido marcada como correo no deseado",
    answerConfirmed: "¡Tu respuesta ha sido aceptada!",
    manualReview: "El equipo del curso está revisando tu respuesta",
    peerReviewGroupTitle: "Peer review questions",
    peerReviewLikertDetails:
      "Evaluate each statement on a scale of 1-5. 1 means strongly disagree, 5 means strongly agree.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "La nota media de las revisiones recibidas es",
    detailedViewLabel: "Todas las revisiones de tu respuesta recibidas",
    errorLabel:
      "Se ha producido un error al mostrar las revisiones de compañeros recibidas. Por favor, actualiza la página.",
    loadingLabel: "Cargando las revisiones de compañeros recibidas...",
    noPeerReviewsReceivedlabel:
      "Tu respuesta aún no ha sido revisada por ningún compañero",
    noSupportForQuestionTypeLabel:
      "Este tipo de respuesta para la revisión entre compañeros no es compatible",
    numberOfPeerReviewsText: n =>
      `Tu respuesta ha sido revisada por ${n} compañero(s)`,
    summaryViewLabel: "Revisiones de compañeros recibidas:",
    toggleButtonExpandLabel: "Ver todas revisiones de compañeros recibidas",
    toggleButtonShrinkLabel: "Ocultar",
    peerReviewLabel: "Revisiones entre compañeros",
    peerReviewReceived: "Has recibido una nueva revisión de un compañero",
    peerReviewReceivedFor: (title: string) =>
      `Has recibido una nueva revisión de un compañero para el ejercicio ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `La respuesta del tipo ${itemType} no es compatible.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Select the correct answer",
    chooseAllSuitableOptionsLabel: "Select all that apply",
    answerCorrectLabel: "Correct",
    answerIncorrectLabel: "Incorrect",
  },
  stage: {
    answerStageLabel: "Answering the exercise",
    givingPeerReviewsStageLabel: "Giving peer reviews",
    receivingPeerReviewsStageLabel: "Receiving peer reviews",
    evaluationStageLabel: "Waiting to be graded",
  },
  general: {
    pastDeadline: "Ya no puedes responder a este ejercicio",
    answerMissingBecauseQuizModifiedLabel:
      "Pregunta no contestada. Probablemente el ejercicio se ha modificado después de tu respuesta.",
    submitButtonLabel: "Enviar",
    errorLabel: "Error",
    loginToViewPromptLabel: "Inicia sesión para ver el ejercicio",
    loginToAnswerPromptLabel: "Inicia sesión para responder al ejercicio",
    loadingLabel: "Cargando",
    answerCorrectLabel: "La respuesta es correcta",
    alreadyAnsweredLabel: "Ya habías respondido",
    answerIncorrectLabel: "La respuesta no es correcta",
    kOutOfNCorrect: (k, n) => `${k}/${n} respuestas correctas`,
    pointsAvailableLabel: "Puntos disponibles para el ejercicio",
    pointsReceivedLabel: "Puntos recibidos",
    incorrectSubmitWhileTriesLeftLabel:
      "La respuesta no era del todo correcta. ¡Inténtalo de nuevo!",
    triesRemainingLabel: "Intentos restantes",
    quizLabel: "Ejercicio",
    pointsLabel: "Puntos",
    triesNotLimitedLabel: "No hay límite de intentos",
    submitGeneralFeedbackLabel: "Enviado",
    submitButtonAlreadyAnsweredLabel: "Respondido",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Para recibir puntos, la respuesta debe ser totalmente correcta"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Respondido",
    unanswered: "Sin respuesta",
    rejected: "Respuesta rechazada, intente nuevamente",
    progressUpdated: "Se ha actualizado el progreso del curso",
    answerConfirmed: "¡Han confirmado tu respuesta!",
    answerConfirmedFor: (title: string) =>
      `¡Han confirmado tu respuesta al ejercicio ${title}!`,
    courseCompleted: "¡Has completado el curso!",
  },
  error: {
    submitFailedError:
      "No se ha podido enviar la respuesta. Inténtalo de nuevo más tarde.",
    quizLoadFailedError: "No se ha podido cargar el ejercicio",
    progressFetchError:
      "No se han podido recuperar los datos de progreso del curso. Inténtalo de nuevo más tarde.",
    submitSpamFlagError: "No se ha podido marcar como no deseado",
    fetchReviewCandidatesError:
      "Se ha producido un error al recuperar las respuestas para la revisión entre compañeros. Inténtalo de nuevo más tarde.",
  },
}

export default spanishLabels
