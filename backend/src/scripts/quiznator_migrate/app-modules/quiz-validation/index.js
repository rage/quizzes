const _ = require("lodash")
const quizTypes = require("app-modules/constants/quiz-types")
const { precise_round } = require("app-modules/utils/math-utils")

function validateAnswer(data, ignoreList = []) {
  // TODO: some checking
  if (!data) {
    throw new Error("no data for validation")
  }

  const { quiz, answer, peerReviews } = data
  const answerData = _.get(answer, "[0].data", {})
  const { regex, multi, rightAnswer } = _.get(quiz, "data.meta", {})
  const { items, choices } = _.get(quiz, "data", {})

  let points = 0
  let normalizedPoints = 0

  let maxPoints = 1

  switch (quiz.type) {
    case quizTypes.ESSAY:
      points = answer[0].confirmed ? 1 : 0
      normalizedPoints = points
      break
    case quizTypes.RADIO_MATRIX:
      points = multi
        ? items
            .map(item => {
              const userAnswer =
                typeof answerData[item.id] === "string"
                  ? [answerData[item.id]]
                  : answerData[item.id]

              if (
                !answerData[item.id] ||
                (!!answerData[item.id] && answerData[item.id].length === 0)
              ) {
                return false
              }
              return (
                userAnswer
                  .map(k => (rightAnswer[item.id] || []).indexOf(k) >= 0)
                  .every(v => !!v) &&
                (rightAnswer[item.id] || [])
                  .map(k => userAnswer.indexOf(k) >= 0)
                  .every(v => !!v)
              )
            })
            .filter(v => v).length
        : items
            .map(item => {
              if (
                !answerData[item.id] ||
                (!!answerData[item.id] && answerData[item.id].length === 0)
              ) {
                return false
              }
              return (
                (rightAnswer[item.id] || []).indexOf(answerData[item.id]) >= 0
              )
            })
            .filter(v => v).length
      maxPoints = items.length
      normalizedPoints = points / maxPoints
      break
    case quizTypes.MULTIPLE_CHOICE:
      points = rightAnswer.some(o => o === answerData) ? 1 : 0
      normalizedPoints = points
      break
    case quizTypes.OPEN:
      if (regex) {
        try {
          let re = new RegExp(rightAnswer)
          points = !!re.exec(answerData.trim().toLowerCase()) ? 1 : 0
        } catch (err) {
          // points 0
        }
      } else {
        points =
          answerData.trim().toLowerCase() === rightAnswer.trim().toLowerCase()
            ? 1
            : 0
      }
      normalizedPoints = points
      break
    case quizTypes.MULTIPLE_OPEN:
      if (regex) {
        points = items
          .map(item => {
            try {
              let re = new RegExp(rightAnswer[item.id])
              return !!re.exec(answerData[item.id].trim().toLowerCase())
            } catch (err) {
              return false
            }
          })
          .filter(v => v).length
      } else {
        points = items
          .map(
            item =>
              answerData[item.id].trim().toLowerCase() ===
              rightAnswer[item.id].trim().toLowerCase(),
          )
          .filter(v => v).length
      }
      maxPoints = items.length
      normalizedPoints = points / maxPoints
      break
    default:
      break
  }

  /*   if (_.includes(ignoreList, quiz._id.toString())) {
    points = maxPoints
    normalizedPoints = 1
  } */

  const returnObject = {
    quiz,
    answer,
    peerReviews,
    validation: {
      points,
      maxPoints,
      normalizedPoints: precise_round(normalizedPoints, 2),
    },
  }

  return returnObject
}

function validateProgress(progress, ignoreList = []) {
  // TODO: better way to toggle ignore between alternatives
  let totalPoints = 0
  let totalMaxPoints = 0
  let totalCompletedMaxPoints = 0
  let totalNormalizedPoints = 0

  let answered = []
  let notAnswered = []
  let rejected = []

  progress.answered &&
    progress.answered.forEach(entry => {
      const validatedAnswer = validateAnswer(entry, ignoreList)

      if (!_.includes(ignoreList, entry.quiz._id.toString())) {
        totalPoints += validatedAnswer.validation.points
        totalMaxPoints += validatedAnswer.validation.maxPoints
        totalCompletedMaxPoints += validatedAnswer.validation.maxPoints
        totalNormalizedPoints += validatedAnswer.validation.normalizedPoints
      }

      answered.push(validatedAnswer)
    })

  progress.notAnswered &&
    progress.notAnswered.map(entry => {
      const { quiz, peerReviews } = entry
      const { items } = quiz.data

      let maxPoints = 0

      if (!_.includes(ignoreList, quiz._id.toString())) {
        if (
          ~[quizTypes.RADIO_MATRIX, quizTypes.MULTIPLE_OPEN].indexOf(quiz.type)
        ) {
          maxPoints = items.length
        } else {
          maxPoints = 1
        }
      }

      totalMaxPoints += maxPoints

      notAnswered.push({
        quiz,
        peerReviews,
        validation: {
          maxPoints,
        },
      })
    })

  progress.rejected &&
    progress.rejected.map(entry => {
      const { quiz, answer, peerReviews } = entry
      const { items } = quiz.data

      let maxPoints = 0

      if (!_.includes(ignoreList, quiz._id.toString())) {
        if (
          ~[quizTypes.RADIO_MATRIX, quizTypes.MULTIPLE_OPEN].indexOf(quiz.type)
        ) {
          maxPoints = items.length
        } else {
          maxPoints = 1
        }
      }

      totalMaxPoints += maxPoints

      rejected.push({
        quiz,
        answer,
        peerReviews,
        validation: {
          points: 0,
          maxPoints,
          normalizedPoints: 0,
        },
      })
    })

  // this looks terrrrible

  const maxNormalizedPoints =
    (progress.answered || []).length +
    (progress.notAnswered || []).length +
    (progress.rejected || []).length -
    ignoreList.length
  const maxCompletedNormalizedPoints =
    (progress.answered || []).length -
    _.intersection(
      (progress.answered || []).map(entry => entry.quiz._id.toString()),
      ignoreList,
    ).length
  const confirmedAmount = (progress.answered || []).filter(entry => {
    return (
      entry.answer[0].confirmed &&
      !_.includes(ignoreList, entry.quiz._id.toString())
    )
  }).length

  const progressWithValidation = {
    answered,
    notAnswered,
    rejected,
    validation: {
      points: totalPoints,
      maxPoints: totalMaxPoints,
      maxCompletedPoints: totalCompletedMaxPoints,
      confirmedAmount,
      normalizedPoints: precise_round(totalNormalizedPoints, 2),
      maxNormalizedPoints,
      maxCompletedNormalizedPoints,
      progress: precise_round((confirmedAmount / maxNormalizedPoints) * 100, 2),
    },
  }

  return progressWithValidation
}

module.exports = { validateAnswer, validateProgress }
