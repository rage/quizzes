import * as XLSX from "xlsx"
import {
  IPeerReviewCollection,
  IPeerReviewCollectionQuestion,
  IPeerReviewCollectionQuestionText,
  IPeerReviewCollectionText,
  IQuiz,
  IQuizItem,
  IQuizItemOption,
  IQuizItemOptionText,
  IQuizItemText,
  IQuizText,
} from "../interfaces"

export const createAndSaveSpaceSeparatedValueFile = (
  data: any[],
  filename: string,
) => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, "ws")

  XLSX.writeFile(
    wb,
    `${filename}.csv`,
    // will not allow the file separator property in options otherwise
    // @ts-ignore
    { bookType: "csv", FS: " " },
  )
}

const quizFields = [
  "grantPointsPolicy",
  "courseId",
  "part",
  "section",
  "points",
  "tries",
  "triesLimited",
  "open",
  "autoConfirm",
  "excludedFromScore",
  "awardPointsEvenIfWrong",
]

export const quizContentsDiffer = (quiz1?: IQuiz, quiz2?: IQuiz): boolean => {
  if (quiz1 === undefined || quiz2 === undefined) {
    if (quiz1 === quiz2) {
      return false
    }
    return true
  }

  if (quizFields.some((field) => quiz1[field] !== quiz2[field])) {
    return true
  }

  if (quiz1.deadline || quiz2.deadline) {
    if (!quiz1.deadline || !quiz2.deadline) {
      return true
    }

    let deadline1: string | Date = new Date(quiz1.deadline)
    let deadline2: string | Date = new Date(quiz2.deadline)

    deadline1 = deadline1.toISOString().substring(0, 16)

    deadline2 = deadline2.toISOString().substring(0, 16)

    if (deadline1 !== deadline2) {
      return true
    }
  }

  return (
    itemsDiffer(quiz1.items, quiz2.items) ||
    quizTextsDiffer(quiz1.texts, quiz2.texts) ||
    peerReviewCollectionsDiffer(
      quiz1.peerReviewCollections,
      quiz2.peerReviewCollections,
    )
  )
}

const quizItemFields = [
  "id",
  "quizId",
  "type",
  "order",
  "minWords",
  "maxWords",
  "minValue",
  "maxValue",
  "validityRegex",
  "formatRegex",
  "multi",
  "usesSharedOptionFeedbackMessage",
]

const quizItemTextFields = [
  "quizItemId",
  "languageId",
  "title",
  "body",
  "minLabel",
  "maxLabel",
  "successMessage",
  "failureMessage",
]

const quizItemOptionFields = ["id", "quizItemId", "order", "correct"]

const quizOptionTextFields = [
  "quizOptionId",
  "languageId",
  "title",
  "body",
  "successMessage",
  "failureMessage",
]

const itemsDiffer = (items1: IQuizItem[], items2: IQuizItem[]): boolean => {
  if (items1.length !== items2.length) {
    return true
  }

  if (!elementsHaveSamePropertyValues(items1, items2, quizItemFields)) {
    return true
  }

  const allTexts1 = items1.reduce(
    (accTexts: IQuizItemText[], item) => accTexts.concat(item.texts),
    [],
  )
  const allTexts2 = items2.reduce(
    (accTexts: IQuizItemText[], item) => accTexts.concat(item.texts),
    [],
  )

  if (
    allTexts1.length !== allTexts2.length ||
    !elementsHaveSamePropertyValues(allTexts1, allTexts2, quizItemTextFields)
  ) {
    return true
  }

  if (items1.some((item) => item.usesSharedOptionFeedbackMessage)) {
    const textArrays1 = items1
      .filter((item) => item.usesSharedOptionFeedbackMessage)
      .map((item) => item.texts)
    const textArrays2 = items2
      .filter((item) => item.usesSharedOptionFeedbackMessage)
      .map((item) => item.texts)
    if (textArrays1.length !== textArrays2.length) {
      return true
    }
    const allOptionTexts1 = textArrays1.reduce(
      (accTexts: IQuizItemText[], elem) => accTexts.concat(elem),
      [],
    )
    const allOptionTexts2 = textArrays2.reduce(
      (accTexts: IQuizItemText[], elem) => accTexts.concat(elem),
      [],
    )

    if (
      !elementsHaveSamePropertyValues(allOptionTexts1, allOptionTexts2, [
        "quizId",
        "sharedOptionFeedbackMessage",
      ])
    ) {
      return true
    }
  }

  const allOptions1 = items1.reduce(
    (accOptions: IQuizItemOption[], qi) => accOptions.concat(qi.options),
    [],
  )
  const allOptions2 = items2.reduce(
    (accOptions: IQuizItemOption[], qi) => accOptions.concat(qi.options),
    [],
  )

  if (
    allOptions1.length !== allOptions2.length ||
    !elementsHaveSamePropertyValues(
      allOptions1,
      allOptions2,
      quizItemOptionFields,
    )
  ) {
    return true
  }

  const optionTexts1 = allOptions1.reduce(
    (accTexts: IQuizItemOptionText[], option) => accTexts.concat(option.texts),
    [],
  )
  const optionTexts2 = allOptions2.reduce(
    (accTexts: IQuizItemOptionText[], option) => accTexts.concat(option.texts),
    [],
  )

  return (
    optionTexts1.length !== optionTexts2.length ||
    !elementsHaveSamePropertyValues(
      optionTexts1,
      optionTexts2,
      quizOptionTextFields,
    )
  )
}

const quizTextFields = [
  "quizId",
  "languageId",
  "title",
  "body",
  "submitMessage",
]

const quizTextsDiffer = (
  texts1: IQuizText[],
  allTexts2: IQuizText[],
): boolean => {
  if (texts1.length !== allTexts2.length) {
    return true
  }
  return !elementsHaveSamePropertyValues(texts1, allTexts2, quizTextFields)
}

const peerReviewCollectionFields = ["id", "quizId"]

const peerReviewQuestionFields = [
  "id",
  "quizId",
  "peerReviewCollectionId",
  "default",
  "type",
  "answerRequired",
  "order",
]

const peerReviewQuestionTextFields = [
  "languageId",
  "title",
  "body",
  "peerReviewQuestionId",
]

const peerReviewCollectionTextFields = [
  "peerReviewCollectionId",
  "languageId",
  "title",
  "body",
]

const peerReviewCollectionsDiffer = (
  prc1: IPeerReviewCollection[] | undefined,
  prc2: IPeerReviewCollection[] | undefined,
): boolean => {
  if (typeof prc1 !== typeof prc2) {
    return true
  }
  if (prc1 === undefined || prc2 === undefined) {
    return false
  }
  if (
    prc1.length !== prc2.length ||
    !elementsHaveSamePropertyValues(prc1, prc2, peerReviewCollectionFields)
  ) {
    return true
  }

  const allQuestions1 = prc1.reduce(
    (accQuestions: IPeerReviewCollectionQuestion[], prc) =>
      accQuestions.concat(prc.questions),
    [],
  )
  const allQuestions2 = prc2.reduce(
    (accQuestions: IPeerReviewCollectionQuestion[], prc) =>
      accQuestions.concat(prc.questions),
    [],
  )

  if (
    allQuestions1.length !== allQuestions2.length ||
    !elementsHaveSamePropertyValues(
      allQuestions1,
      allQuestions2,
      peerReviewQuestionFields,
    )
  ) {
    return true
  }

  const allQuestionTexts1 = allQuestions1.reduce(
    (accTexts: IPeerReviewCollectionQuestionText[], question) =>
      accTexts.concat(question.texts),
    [],
  )
  const allQuestionTexts2 = allQuestions2.reduce(
    (accTexts: IPeerReviewCollectionQuestionText[], question) =>
      accTexts.concat(question.texts),
    [],
  )

  if (
    allQuestionTexts1.length !== allQuestionTexts2.length ||
    !elementsHaveSamePropertyValues(
      allQuestionTexts1,
      allQuestionTexts2,
      peerReviewQuestionTextFields,
    )
  ) {
    return true
  }

  const allTexts1 = prc1.reduce(
    (accTexts: IPeerReviewCollectionText[], prc) => accTexts.concat(prc.texts),
    [],
  )
  const allTexts2 = prc2.reduce(
    (accTexts: IPeerReviewCollectionText[], prc) => accTexts.concat(prc.texts),
    [],
  )

  return (
    allTexts1.length !== allTexts2.length ||
    !elementsHaveSamePropertyValues(
      allTexts1,
      allTexts2,
      peerReviewCollectionTextFields,
    )
  )
}

const elementsHaveSamePropertyValues = (
  arr1: any[],
  arr2: any[],
  propertyNames: string[],
): boolean => {
  return arr1.every((elem1) =>
    arr2.some((elem2) => {
      return propertyNames.every(
        (propName) =>
          (!elem1[propName] && !elem2[propName]) ||
          elem1[propName] === elem2[propName],
      )
    }),
  )
}
