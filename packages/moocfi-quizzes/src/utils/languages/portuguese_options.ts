import { SingleLanguageLabels } from "./index"

const portugueseLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Exemplo de resposta",
    userAnswerLabel: "A sua resposta",
    currentNumberOfWordsLabel: "N.º de palavras",
    textFieldLabel: "A sua resposta",
    conformToLimitsToSubmitLabel:
      "Para poder enviar a resposta, certifique-se de que cumpre o limite máximo de palavras",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }

      if (!min) {
        return `A sua resposta não pode exceder ${max} palavras`
      }

      if (!max) {
        return `A sua resposta deve ter, pelo menos, ${min} palavras`
      }

      return `A sua resposta deve ter entre ${min} e ${max} palavras`
    },
  },
  open: {
    placeholder: "Resposta",
    userAnswerLabel: "A sua resposta",
    feedbackForFailure: "A sua resposta está incorreta",
    feedbackForSuccess: "A sua resposta está correta",
  },
  peerReviews: {
    loadingLabel: "A carregar",
    noPeerAnswersAvailableLabel:
      "Não estão disponíveis respostas para avaliação de pares",
    chooseButtonLabel: "Selecionar",
    unselectButtonLabel: "Cancelar seleção",
    chooseEssayInstruction: "Escolha uma opção para avaliar",
    chosenEssayInstruction: "Avalie a resposta que selecionou",
    displayPeerReview: "Realize uma avaliação de pares",
    giveExtraPeerReviews:
      "Realizou o número exigido de avaliações de pares. Quanto mais avaliações de pares realizar, mais rapidamente será avaliada a sua resposta!",
    giveExtraPeerReviewsQuizConfirmed:
      "Pode continuar a realizar avaliações de pares para ajudar os outros",
    givenPeerReviewsLabel: "Avaliações de pares realizadas",
    peerReviewsCompletedInfo:
      "Concluiu um número suficiente de avaliações de pares",
    reportAsInappropriateLabel: "Denunciar como spam",
    submitPeerReviewLabel: "Enviar a avaliação",
    hidePeerReviewLabel: "Ocultar",
    essayQuestionAnswerTextBoxLabel: "Redigir uma avaliação",
    optionLabel: "Opção",
    answerRejected: "A sua resposta foi rejeitada",
    answerFlaggedAsSpam: "A sua resposta foi denunciada como spam",
    answerConfirmed: "A sua resposta foi aceite!",
    manualReview:
      "A sua resposta está a ser avaliada pela equipa de formadores",
    peerReviewGroupTitle: "Perguntas de revisão por pares",
    peerReviewLikertDetails:
      "Avalie cada afirmação em uma escala de 1 a 5. 1 significa discordo totalmente, 5 significa concordo totalmente.",
  },
  receivedPeerReviews: {
    errorLabel:
      "Ocorreu um erro durante a exibição das avaliações de pares recebidas. Tente recarregar a página.",
    noSupportForQuestionTypeLabel:
      "Este tipo de resposta não é compatível com a avaliação por pares",
    loadingLabel: "A carregar as avaliações por pares recebidas...",
    noPeerReviewsReceivedlabel:
      "A sua resposta ainda não foi sujeita a uma avaliação por pares",
    numberOfPeerReviewsText: n =>
      `A sua resposta foi sujeita a ${n} ${
        n > 0 ? "avaliação" : "avaliações"
      } por pares.`,
    toggleButtonExpandLabel: "Mostrar todas as avaliações por pares recebidas",
    toggleButtonShrinkLabel: "Ocultar avaliações por pares",
    averageOfGradesLabel: "A nota média das avaliações recebidas é",
    detailedViewLabel: "Todas as avaliações recebidas pela sua resposta",
    summaryViewLabel: "Avaliações por pares recebidas:",
    peerReviewLabel: "Avaliações por pares",
    peerReviewReceived: "Recebeu uma nova avaliação por pares",
    peerReviewReceivedFor: (title: string) =>
      `Recebeu uma nova avaliação por pares relativa ao exercício ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `A resposta de tipo '${itemType}' não é compatível.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Selecione a resposta correta",
    chooseAllSuitableOptionsLabel: "Selecione todas as opções aplicáveis",
    answerCorrectLabel: "Correto",
    answerIncorrectLabel: "Incorreto",
    selectOption: "select an option",
  },
  stage: {
    answerStageLabel: "A responder ao exercício",
    givingPeerReviewsStageLabel: "A realizar uma avaliação de pares",
    receivingPeerReviewsStageLabel: "A receber avaliações por pares",
    evaluationStageLabel: "À espera de uma classificação",
  },
  general: {
    pastDeadline: "Já não é possível responder a este exercício",
    answerMissingBecauseQuizModifiedLabel:
      "Pergunta não respondida. O questionário foi provavelmente alterado após a sua resposta.",
    submitButtonLabel: "Enviar",
    errorLabel: "Erro",
    loginToViewPromptLabel: "Iniciar sessão para ver o exercício",
    loginToAnswerPromptLabel: "Iniciar sessão para responder ao exercício",
    loadingLabel: "A carregar",
    answerCorrectLabel: "A resposta está correta",
    alreadyAnsweredLabel: "Já respondeu a este exercício",
    answerIncorrectLabel: "A resposta está incorreta",
    kOutOfNCorrect: (k, n) => `${k}/${n} respostas corretas`,
    pointsAvailableLabel: "Pontuação máxima do exercício",
    pointsReceivedLabel: "Pontos recebidos",
    incorrectSubmitWhileTriesLeftLabel:
      "A resposta não estava totalmente correta. Volte a tentar!",
    triesRemainingLabel: "Tentativas restantes",
    quizLabel: "Questionário",
    pointsLabel: "Pontos",
    triesNotLimitedLabel: "Não há um número limite de tentativas",
    submitGeneralFeedbackLabel: "Enviado",
    submitButtonAlreadyAnsweredLabel: "Respondido",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "Para receber pontos, a resposta tem de estar totalmente correta"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Respondido",
    unanswered: "Sem resposta",
    rejected: "A sua resposta foi rejeitada",
    progressUpdated: "Progresso do curso atualizado",
    answerConfirmed: "A sua resposta foi confirmada!",
    answerConfirmedFor: (title: string) =>
      `A sua resposta ao exercício ${title} foi confirmada!`,
    courseCompleted: "Concluiu o curso!",
  },
  error: {
    submitFailedError:
      "Não foi possível enviar a sua resposta. Volte a tentar mais tarde.",
    quizLoadFailedError: "Não foi possível carregar o exercício",
    progressFetchError:
      "Não foi possível recuperar os dados de progresso do curso. Volte a tentar mais tarde.",
    submitSpamFlagError: "Não foi possível denunciar spam",
    fetchReviewCandidatesError:
      "Algo correu mal durante a recuperação das respostas para avaliação por pares. Volte a tentar mais tarde.",
  },
}

export default portugueseLabels
