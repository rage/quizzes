import _ from "lodash"
import { arrayMove } from "react-sortable-hoc"
import { ActionType, createAction } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"
import { post } from "../../services/quizzes"
import { setLanguage } from "../filter/actions"
import * as quizzes from "../quizzes/actions"

export const set = createAction("edit/SET", resolve => {
  return quiz => resolve(quiz)
})

export const create = createAction("edit/NEW", resolve => {
  return (course: any) => resolve(course)
})

export const setEdit = (quiz: any) => {
  const orderedQuiz = JSON.parse(JSON.stringify(quiz))
  orderedQuiz.items = orderedQuiz.items.sort((i1, i2) => i1.order - i2.order)
  orderedQuiz.items.map(
    item => (item.options = item.options.sort((o1, o2) => o1.order - o2.order)),
  )
  /*orderedQuiz.peerReviewQuestions = orderedQuiz.peerReviewQuestions.sort(
    (p1, p2) => p1.order - p2.order,
  )*/
  return dispatch => {
    dispatch(set(checkForMissingTranslation(orderedQuiz)))
  }
}

export const save = () => {
  return async (dispatch, getState) => {
    try {
      const quiz = await post(getState().edit)
      const index = getState().quizzes.findIndex(q => q.id === quiz.id)
      if (index > -1) {
        dispatch(quizzes.remove(index))
      }
      dispatch(quizzes.set([quiz]))
      dispatch(setEdit(quiz))
    } catch (error) {
      console.log(error)
    }
  }
}

export const newQuiz = () => {
  return (dispatch, getState) => {
    const course = getState().courses.find(
      c => c.id === getState().filter.course,
    )
    const quiz = {
      part: 0,
      section: 0,
      courseId: course.id,
      course,
      texts: [],
      items: [],
      peerReviewQuestions: [],
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

export const addReview = () => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const peerReviewQuestionCollection = {
      quizId: quiz.id,
      texts: [],
      questions: [],
    }
    quiz.peerReviewQuestionCollections.push(peerReviewQuestionCollection)
    dispatch(setEdit(quiz))
  }
}

export const addReviewQuestion = (index, type) => {
  return (dispatch, getState) => {
    const quiz = JSON.parse(JSON.stringify(getState().edit))
    const collection = quiz.peerReviewQuestionCollections[index]
    const peerReviewQuestion = {
      quizId: quiz.id,
      default: false,
      type,
      answerRequired: true,
      order: collection.questions.length,
      texts: [],
    }
    if (collection.id) {
      Object.assign(peerReviewQuestion, { collectionId: collection.id })
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
    dispatch(set(quiz))
  }
}

const checkForMissingTranslation = paramQuiz => {
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
    quiz.peerReviewQuestionCollections.map((prqc, i) => {
      if (!prqc.texts.find(text => text.languageId === language)) {
        const newText = {
          languageId: language,
          title: `peer review collection title ${language}`,
          body: "",
        }
        if (prqc.id) {
          Object.assign(newText, { peerReviewQuestionCollectionId: prqc.id })
        }
        quiz.peerReviewQuestionCollections[i].texts.push(newText)
      }
      prqc.questions.map((prq, j) => {
        if (!prq.texts.find(text => text.languageId === language)) {
          const newText = {
            languageId: language,
            title: `peer review question title ${language}`,
            body: "",
          }
          if (prq.id) {
            Object.assign(newText, { peerReviewQuestionId: prqc.id })
          }
          quiz.peerReviewQuestionCollections[i].questions[j].texts.push(newText)
        }
      })
    })
  })
  return quiz
}
