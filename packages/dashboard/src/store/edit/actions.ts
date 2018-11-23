import _ from "lodash"
import { arrayMove } from "react-sortable-hoc"
import { ActionType, createAction } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"
import { post } from "../../services/quizzes"
import { setFilter } from "../filter/actions"

export const set = createAction("edit/SET", resolve => {
  return quiz => resolve(quiz)
})

export const create = createAction("edit/NEW", resolve => {
  return (course: any) => resolve(course)
})

export const setEdit = (quiz: any) => {
  return dispatch => {
    dispatch(set(checkForMissingTranslation(quiz)))
    dispatch(setFilter("language", quiz.course.languages[0].id))
  }
}

export const save = () => {
  return async (dispatch, getState) => {
    await post(getState().edit)
  }
}

export const newQuiz = () => {
  return (dispatch, getState) => {
    const course = getState().courses.find(
      c => c.id === getState().filter.course,
    )
    const quiz = {
      course,
      texts: [],
      items: [],
    }
    dispatch(setEdit(quiz))
    /*dispatch(
      create({
        courseId: course.id,
        course,
      }),
    )*/
    // dispatch(setFilter("language", course.languages[0].id))
  }
}

export const changeAttr = (path, value) => {
  return (dispatch, getState) => {
    const quiz = Object.assign({}, getState().edit)
    _.set(quiz, path, value)
    dispatch(set(quiz))
  }
}

export const changeOrder = (path, current, next) => {
  return (dispatch, getState) => {
    const quiz = Object.assign({}, getState().edit)
    const array = _.get(quiz, path).sort((o1, o2) => o1.order - o2.order)
    array[current].order = next
    array[next].order = current
    dispatch(set(quiz))
  }
}

export const addItem = type => {
  console.log(type)
  return (dispatch, getState) => {
    const quiz = Object.assign({}, getState().edit)
    const item = {
      quizId: quiz.id,
      type,
      order: quiz.items.length,
      validityRegex: undefined,
      formatRegex: undefined,
      texts: [],
      options: [],
    }
    console.log(item)
    quiz.items.push(item)
    dispatch(setEdit(quiz))
  }
}

export const addOption = item => {
  console.log(item)
  return (dispatch, getState) => {
    const quiz = Object.assign({}, getState().edit)
    const option = {
      quizItemId: quiz.items[item].id,
      order: quiz.items[item].options.length,
      correct: false,
      texts: [],
    }
    console.log(option)
    quiz.items[item].options.push(option)
    dispatch(setEdit(quiz))
  }
}

const checkForMissingTranslation = paramQuiz => {
  const quiz = Object.assign({}, paramQuiz)
  const languages = quiz.course.languages.map(l => l.id)
  languages.map(language => {
    if (!quiz.texts.find(text => text.languageId === language)) {
      quiz.texts.push({
        quizId: quiz.id || "",
        languageId: language,
        title: `quiz title ${language}`,
        body: `quiz body ${language}`,
      })
    }
    quiz.items.map((item, i) => {
      if (!item.texts.find(text => text.languageId === language)) {
        quiz.items[i].texts.push({
          quizItemId: item.id,
          languageId: language,
          title: `item ${item.order} title ${language}`,
          body: null,
          successMessage: null,
          failureMessage: null,
        })
      }
      item.options.map((option, j) => {
        if (!option.texts.find(text => text.languageId === language)) {
          quiz.items[i].options[j].texts.push({
            quizOptionId: option.id,
            languageId: language,
            title: `item ${option.order} title ${language}`,
            body: null,
            successMessage: null,
            failureMessage: null,
          })
        }
      })
    })
  })
  return quiz
}
