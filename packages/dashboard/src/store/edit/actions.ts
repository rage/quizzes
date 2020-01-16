import _ from "lodash"
import { ActionType, createAction } from "typesafe-actions"
import { IQuiz } from "../../interfaces"

import { post } from "../../services/quizzes"
import { displayMessage } from "../notification/actions"
import * as quizActions from "../quizzes/actions"

export const set = createAction("edit/SET", resolve => {
  return quiz => resolve(quiz)
})

export const create = createAction("edit/NEW", resolve => {
  return (course: any) => resolve(course)
})

export const setEdit = (quiz: any) => {
  const orderedQuiz: IQuiz = JSON.parse(JSON.stringify(quiz))
  if (!orderedQuiz.items) {
    return
  }
  orderedQuiz.items = orderedQuiz.items.sort((i1, i2) => i1.order - i2.order)
  orderedQuiz.items.map(item => {
    const newItem = {
      options: item.options.sort((o1, o2) => o1.order - o2.order),
      ...item,
    }
    return newItem
  })
  /*orderedQuiz.peerReviewQuestions = orderedQuiz.peerReviewQuestions.sort(
    (p1, p2) => p1.order - p2.order,
  )*/
  const checkedQuiz = checkForMissingTranslation(orderedQuiz)

  if (checkedQuiz.deadline) {
    checkedQuiz.deadline = new Date(checkedQuiz.deadline)
  }

  return dispatch => {
    dispatch(set(checkedQuiz))
  }
}

export const save = () => {
  return async (dispatch, getState) => {
    try {
      const quiz = await post(getState().edit, getState().user)
      dispatch(quizActions.set({ courseId: quiz.courseId, quizzes: [quiz] }))
      dispatch(setEdit(quiz))
      dispatch(
        displayMessage(`Successfully saved ${quiz.texts[0].title}!`, false),
      )
    } catch (error) {
      dispatch(
        displayMessage(
          `Failed to save changes to ${getState().edit.texts[0].title}. ${
            error.message
          }`,
          true,
        ),
      )
    }
  }
}

export const newQuiz = () => {
  return (dispatch, getState) => {
    const course = getState().courses.find(
      c => c.id === getState().filter.course,
    )
    const quiz: IQuiz & { peerReviewCollections: any[] } = {
      part: 0,
      section: 0,
      courseId: course.id,
      course,
      texts: [],
      items: [],
      peerReviewCollections: [],
      tries: 1,
      triesLimited: true,
      grantPointsPolicy: "grant_whenever_possible",
      autoConfirm: true,
    }
    dispatch(set(checkForMissingTranslation(quiz)))
  }
}

export const changeAttr = (path, value) => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    _.set(quiz, path, value)
    dispatch(set(quiz))
  }
}

export const changeOrder = (path, current, next) => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const array = _.get(quiz, path).sort((o1, o2) => o1.order - o2.order)
    const moved = array.splice(current, 1)[0]
    array.splice(next, 0, moved)
    array.map((object, index) => (object.order = index))
    dispatch(set(quiz))
  }
}

export const addItem = type => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))

    const item = {
      quizId: quiz.id,
      type,
      order: quiz.items.length,
      validityRegex: undefined,
      formatRegex: undefined,
      texts: [],
      options: [],
    }

    quiz.items.push(item)
    dispatch(setEdit(quiz))
    if (type === "checkbox" || type === "research-agreement") {
      const updatedQuiz = JSON.parse(JSON.stringify(getState().edit))
      const idx = updatedQuiz.items.length - 1
      dispatch(addOption(idx))
    }
  }
}

export const addOption = item => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const option = {
      order: quiz.items[item].options.length,
      correct: false,
      texts: [],
    }
    if (quiz.items[item].id) {
      _.set(option, "quizItemId", quiz.items[item].id)
    }
    quiz.items[item].options.push(option)
    dispatch(setEdit(quiz))
  }
}

// atm for research-agreement
export const updateMultipleOptions = (itemOrder, optionData) => {
  return (dispatch, getState) => {
    let quiz = JSON.parse(JSON.stringify(getState().edit))
    const item = quiz.items[itemOrder]
    const oldOptions = item.options
    item.options = optionData.map(optData => {
      if (!optData.id) {
        return {
          order: optData.order,
          quizItemId: item.id,
          correct: true,
          texts: [],
        }
      } else {
        const modifiedOption = oldOptions.find(opt => opt.id === optData.id)
        modifiedOption.order = optData.order
        return modifiedOption
      }
    })
    dispatch(setEdit(quiz))

    quiz = JSON.parse(JSON.stringify(getState().edit))

    quiz.items[itemOrder].options.forEach(option => {
      const optData = optionData.find(od => od.order === option.order)
      option.texts[0].title = optData.title
      option.texts[0].body = optData.body
      option.correct = optData.correct
      option.texts[0].failureMessage = optData.failureMessage
      option.texts[0].successMessage = optData.successMessage
    })
    dispatch(setEdit(quiz))
  }
}

export const addFinishedOption = (item, optionData) => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const option = {
      order: quiz.items[item].options.length,
      correct: optionData.correct,
      texts: [],
    }
    if (quiz.items[item].id) {
      _.set(option, "quizItemId", quiz.items[item].id)
    }
    quiz.items[item].options.push(option)
    dispatch(setEdit(quiz))
    const updatedQuiz = JSON.parse(JSON.stringify(getState().edit))
    const idx = quiz.items[item].options.length - 1
    updatedQuiz.items[item].options[idx].texts[0].title = optionData.title
    updatedQuiz.items[item].options[idx].texts[0].failureMessage =
      optionData.failureMessage
    updatedQuiz.items[item].options[idx].texts[0].successMessage =
      optionData.successMessage
    updatedQuiz.items[item].options[idx].correct = optionData.correct
    dispatch(setEdit(updatedQuiz))
  }
}

export const modifyOption = (item, optionData) => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const option = quiz.items[item].options.find(o => o.id === optionData.id)
    quiz.items[item].options = quiz.items[item].options.map(o =>
      o.id === option.id
        ? {
            ...o,
            correct: optionData.correct,
            texts: [
              {
                ...o.texts[0],
                title: optionData.title,
                failureMessage: optionData.failureMessage,
                successMessage: optionData.successMessage,
              },
            ],
          }
        : o,
    )
    dispatch(setEdit(quiz))
  }
}

export const addReview = () => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const peerReviewCollection = {
      quizId: quiz.id,
      texts: [],
      questions: [],
    }
    quiz.peerReviewCollections.push(peerReviewCollection)
    dispatch(setEdit(quiz))
  }
}

export const addReviewQuestion = (index, type) => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const collection = quiz.peerReviewCollections[index]
    const peerReviewQuestion = {
      quizId: quiz.id,
      default: false,
      type,
      answerRequired: true,
      order: collection.questions.length,
      texts: [],
    }
    if (collection.id) {
      Object.assign(peerReviewQuestion, {
        peerReviewCollectionId: collection.id,
      })
    }
    collection.questions.push(peerReviewQuestion)
    dispatch(setEdit(quiz))
  }
}

export const remove = (path, index) => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const array = _.get(quiz, path)
    array.splice(index, 1)
    quiz[path] = array.map((arrayItem, idx) => ({ ...arrayItem, order: idx }))
    dispatch(setEdit(quiz))
  }
}

const checkForMissingTranslation = (paramQuiz: IQuiz) => {
  const quiz = JSON.parse(JSON.stringify(paramQuiz))
  const languages = quiz.course.languages.map(l => l.id)
  languages.map(language => {
    if (!quiz.texts.find(text => text.languageId === language)) {
      const newText = {
        languageId: language,
        title: `quiz title ${language}`,
        body: `quiz body ${language}`,
      }
      if (quiz.id) {
        Object.assign(newText, { quizId: quiz.id })
      }
      quiz.texts.push(newText)
    }
    quiz.items.map((item, i) => {
      if (!item.texts.find(text => text.languageId === language)) {
        const newText = {
          languageId: language,
          title: `${item.type} item ${item.order} title ${language}`,
          body: null,
          successMessage: null,
          failureMessage: null,
        }
        if (item.id) {
          Object.assign(newText, { quizItemId: item.id })
        }
        quiz.items[i].texts.push(newText)
      }
      item.options.map((option, j) => {
        if (!option.texts.find(text => text.languageId === language)) {
          const newText = {
            languageId: language,
            title: `option ${option.order} title ${language}`,
            body: null,
            successMessage: null,
            failureMessage: null,
          }
          if (option.id) {
            Object.assign(newText, { quizOptionId: option.id })
          }
          quiz.items[i].options[j].texts.push(newText)
        }
      })
    })
    quiz.peerReviewCollections.map((prc, i) => {
      if (!prc.texts.find(text => text.languageId === language)) {
        const newText = {
          languageId: language,
          title: `peer review collection title ${language}`,
          body: "",
        }
        if (prc.id) {
          Object.assign(newText, { peerReviewCollectionId: prc.id })
        }
        quiz.peerReviewCollections[i].texts.push(newText)
      }
      prc.questions.map((prq, j) => {
        if (!prq.texts.find(text => text.languageId === language)) {
          const newText = {
            languageId: language,
            title: `peer review question title ${language}`,
            body: "",
          }
          if (prq.id) {
            Object.assign(newText, { peerReviewQuestionId: prc.id })
          }
          quiz.peerReviewCollections[i].questions[j].texts.push(newText)
        }
      })
    })
  })
  return quiz
}
