import { SingleLanguageLabels } from "./index"

const bulgarianLabels: SingleLanguageLabels = {
  essay: {
    exampleAnswerLabel: "Примерен отговор",
    userAnswerLabel: "Отговор",
    currentNumberOfWordsLabel: "Брой думи",
    textFieldLabel: "Отговор",
    conformToLimitsToSubmitLabel:
      "Можете да изпратите само отговор, който отговаря на ограничението за броя на думите",
    wordLimitsGuidance: (min, max) => {
      if (!min && !max) {
        return ""
      }
      if (!min) {
        return `Вашият отговор не трябва да надвишава ${max} думи`
      }

      if (!max) {
        return `Вашият отговор трябва да бъде най-малко ${min} думи`
      }
      return `Вашият отговор трябва да бъде между ${min} и ${max} думи`
    },
  },
  open: {
    placeholder: "Отговор",
    userAnswerLabel: "Вашият отговор",
    feedbackForSuccess: "Правилен отговор",
    feedbackForFailure: "Неправилен отговор",
  },
  peerReviews: {
    loadingLabel: "Зарежда се",
    chooseButtonLabel: "Изберете",
    unselectButtonLabel: "Отмяна на избора",
    chooseEssayInstruction: "Изберете за проверка един вариант",
    chosenEssayInstruction: "Направете проверка на избрания отговор",
    givenPeerReviewsLabel: "Направени партньорски проверки",
    noPeerAnswersAvailableLabel: "Няма отговори за партньорска проверка",
    reportAsInappropriateLabel: "Докладвайте спам",
    submitPeerReviewLabel: "Изпрати проверката",
    peerReviewsCompletedInfo: "Направили сте достатъчно партньорски проверки",
    giveExtraPeerReviews:
      "Направихте изисквания брой партньорски проверки Ако направите повече партньорски проверки, отговорът Ви ще бъде проверен по-бързо!",
    giveExtraPeerReviewsQuizConfirmed:
      "Можете да направите още партньорски проверки, за да помогнете на другите.",
    displayPeerReview: "Направете партньорска проверка",
    hidePeerReviewLabel: "Скрий",
    essayQuestionAnswerTextBoxLabel: "Напиши проверка",
    optionLabel: "Вариант",
    answerRejected: "Отговорът Ви не е приет",
    answerFlaggedAsSpam: "Вашият отговор е докладван като спам",
    answerConfirmed: "Отговорът е приет!",
    manualReview: "Ръководещите курса проверяват отговора Ви",
    peerReviewGroupTitle: "Peer review questions",
    peerReviewLikertDetails:
      "Evaluate each statement on a scale of 1-5. 1 means strongly disagree, 5 means strongly agree.",
  },
  receivedPeerReviews: {
    averageOfGradesLabel: "Средната оценка от получените проверки е",
    detailedViewLabel: "Всички проверки за Вашия отговор",
    errorLabel:
      "Грешка при изобразяването на получените партньорски проверки. Моля, опитайте се да заредите страницата отново.",
    loadingLabel: "Зареждане на получените партньорски проверки...",
    noPeerReviewsReceivedlabel:
      "Вашият отговор още не е получил партньорска проверка",
    noSupportForQuestionTypeLabel:
      "Този вид отговор, подлежащ на партньорска проверка, не се поддържа",
    numberOfPeerReviewsText: n =>
      `Вашият отговор е преминал през партньорска ${n} проверка/проверки`,
    summaryViewLabel: "Получени партньорски проверки:",
    toggleButtonExpandLabel: "Покажи всички получени партньорски проверки",
    toggleButtonShrinkLabel: "Скрий партньорските проверки",
    peerReviewLabel: "Партньорска проверка",
    peerReviewReceived: "Получихте нова партньорска проверка",
    peerReviewReceivedFor: (title: string) =>
      `Получихте нова партньорска проверка за упражнение ${title}`,
  },
  unsupported: {
    notSupportedInsert: (itemType: string) =>
      `Отговор от тип '${itemType}' не се поддържа.`,
  },
  multipleChoice: {
    selectCorrectAnswerLabel: "Изберете правилния отговор",
    chooseAllSuitableOptionsLabel: "Изберете всички приложими отговори",
    answerCorrectLabel: "Правилен отговор",
    answerIncorrectLabel: "Неправилен отговор",
  },
  stage: {
    answerStageLabel: "Отговор на упражнението",
    givingPeerReviewsStageLabel: "Ваш ред е да направите партньорски проверки",
    receivingPeerReviewsStageLabel:
      "Ваш ред е да получите партньорски проверки",
    evaluationStageLabel: "В очакване на оценка",
  },
  general: {
    pastDeadline: "Вече не можете да отговорите на това упражнение",
    answerMissingBecauseQuizModifiedLabel:
      "На този въпрос не е получен отговор. Тестът вероятно е бил изменен след Вашия отговор.",
    submitButtonLabel: "Изпращане",
    errorLabel: "Грешка",
    loginToViewPromptLabel: "Влезте в профила си, за да видите упражнението",
    loginToAnswerPromptLabel:
      "Влезте в профила си, за да отговорите на упражнението",
    loadingLabel: "Зарежда се",
    answerCorrectLabel: "Правилен отговор",
    alreadyAnsweredLabel: "Вече сте отговорили на този въпрос",
    answerIncorrectLabel: "Неправилен отговор",
    kOutOfNCorrect: (k, n) => `${k}/${n} правилни отговори`,
    pointsAvailableLabel: "Точки за това упражнение",
    pointsReceivedLabel: "Получени точки",
    incorrectSubmitWhileTriesLeftLabel:
      "Отговорът не беше напълно правилен. Моля, опитайте отново!",
    triesRemainingLabel: "Оставащи опити",
    quizLabel: "Тест",
    pointsLabel: "Точки",
    triesNotLimitedLabel: "Неограничен брой опити",
    submitGeneralFeedbackLabel: "Изпратено",
    submitButtonAlreadyAnsweredLabel: "Вече сте отговорили",
    pointsGrantingPolicyInformer: policy => {
      switch (policy) {
        case "grant_only_when_answer_fully_correct":
          return "За да получите точки, отговорът трябва да е напълно правилен"
        case "grant_whenever_possible":
          return ""
        default:
          return ""
      }
    },
    answered: "Отговорено",
    unanswered: "Отговорено",
    rejected: "Отхвърлен отговор, опитайте отново",
    progressUpdated: "Актуализирани са данните за достигнатия етап в курса",
    answerConfirmed: "Отговорът е приет!",
    answerConfirmedFor: (title: string) =>
      `Вашият отговор на упражнение ${title} беше потвърден!`,
    courseCompleted: "Вие приключихте курса!",
  },
  error: {
    submitFailedError:
      "Отговорът Ви не може да се изпрати. Моля, опитайте отново по-късно.",
    quizLoadFailedError: "Упражнението не може да се зареди",
    progressFetchError:
      "Неуспешно зареждане на Вашите данни за достигнатия етап в курса. Моля, опитайте отново по-късно.",
    submitSpamFlagError: "Неуспешно докладване на спам.",
    fetchReviewCandidatesError:
      "Неуспешно зареждане на отговорите за партньорска проверка. Моля, опитайте отново по-късно.",
  },
}

export default bulgarianLabels
