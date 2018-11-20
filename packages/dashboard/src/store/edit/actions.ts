import _ from "lodash"
import { ActionType, createAction } from "typesafe-actions"
import {
  INewQuizQuery,
  INewQuizTranslation,
} from "../../../../common/src/types/index"
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

export const newQuiz = () => {
  return (dispatch, getState) => {
    const course = getState().courses.find(
      c => c.id === getState().filter.course,
    )
    dispatch(
      create({
        courseId: course.id,
        course,
      }),
    )
    dispatch(setFilter("language", course.languages[0].id))
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
    console.log(current, next)
    array[current].order = next
    if (current - next > 0) {
      array[current - 1].order = current
    } else {
      array[current + 1].order = current
    }
    dispatch(set(quiz))
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
        title: "",
        body: "",
      })
    }
    quiz.items.map((item, i) => {
      if (!item.texts.find(text => text.languageId === language)) {
        quiz.items[i].texts.push({
          quizItemId: item.id,
          languageId: language,
          title: "",
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
            title: "",
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
