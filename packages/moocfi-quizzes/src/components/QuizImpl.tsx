import * as React from "react"
import { useCallback, useState, useEffect } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { Button, Typography } from "@material-ui/core"
import * as languageActions from "../state/language/actions"
import * as messageActions from "../state/message/actions"
import * as quizActions from "../state/quiz/actions"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import * as submitLockedActions from "../state/submitLocked/actions"
import * as userActions from "../state/user/actions"
import * as userQuizStateActions from "../state/userQuizState/actions"

import Checkbox from "./Checkbox"
import Feedback from "./Feedback"
import MultipleChoice from "./MultipleChoice"
import ResearchAgreement from "./ResearchAgreement"
import Scale from "./Scale"
import Open from "./Open"
import Essay from "./Essay"
import StageVisualizer from "./Essay/StageVisualizer"
import PeerReviews from "./Essay/PeerReviews"
import Unsupported from "./Unsupported"
import languageLabels from "../utils/language_labels"
import { wordCount } from "../utils/string_tools"
// don't use common!
import {
  UserCourseState,
  UserQuizState,
  QuizAnswer,
} from "../../../common/src/models"
import { postAnswer } from "../services/answerService"
import { getQuizInfo } from "../services/quizService"
import BASE_URL from "../config"

type ComponentName =
  | "essay"
  | "multiple-choice"
  | "scale"
  | "checkbox"
  | "open"
  | "research-agreement"
  | "feedback"
  | "custom-frontend-accept-data"

const componentType = (typeName: ComponentName) => {
  const mapTypeToComponent = {
    essay: Essay,
    "multiple-choice": MultipleChoice,
    scale: Scale,
    checkbox: Checkbox,
    open: Open,
    "research-agreement": ResearchAgreement,
    feedback: Feedback,
    "custom-frontend-accept-data": Unsupported,
  }

  return mapTypeToComponent[typeName]
}

export interface Props {
  id: string
  languageId: string
  accessToken: string
  baseUrl: string
}

const FuncQuizImpl: React.FunctionComponent<Props> = ({
  id,
  languageId,
  accessToken,
}) => {
  const submitLocked = useSelector(
    (state: any) => state.submitLocked,
    shallowEqual,
  )
  const setSubmitLocked = (state: boolean) =>
    dispatch(submitLockedActions.set(state))

  const error = useSelector((state: any) => state.message, shallowEqual)
  const setError = (newError: string) => dispatch(messageActions.set(newError))

  const quizAnswer = useSelector((state: any) => state.quizAnswer, shallowEqual)
  const setQuizAnswer = (newQuizAnswer: QuizAnswer) =>
    dispatch(quizAnswerActions.set(newQuizAnswer))

  const userQuizState = useSelector(
    (state: any) => state.userQuizState,
    shallowEqual,
  )
  const setUserQuizState = (newUqs: UserQuizState) =>
    dispatch(userQuizStateActions.set(newUqs))

  const quiz = useSelector((state: any) => state.quiz, shallowEqual)
  const dispatch = useDispatch()

  useEffect(() => {
    const initialize = async () => {
      try {
        let { quiz, quizAnswer, userQuizState } = await getQuizInfo(
          id,
          languageId,
          accessToken,
        )

        if (!quizAnswer) {
          quizAnswer = {
            quizId: quiz.id,
            languageId,
            itemAnswers: quiz.items.map(item => {
              return {
                quizItemId: item.id,
                textData: "",
                intData: null,
                optionAnswers: [],
              }
            }),
          }
        }

        dispatch(userActions.set(accessToken))
        dispatch(languageActions.set(languageId))
        dispatch(quizActions.set(quiz))
        dispatch(quizAnswerActions.set(quizAnswer))
        dispatch(userQuizStateActions.set(userQuizState))
      } catch (e) {
        setError(e.toString())
      }
    }

    initialize()
  }, [])

  const handleDataChange = (itemId: string, attributeName: string) => event => {
    const value = event.target.value
    const itemAnswers = quizAnswer.itemAnswers.map(itemAnswer => {
      if (itemAnswer.quizItemId === itemId) {
        const updated = { ...itemAnswer }
        updated[attributeName] = value
        return updated
      }
      return itemAnswer
    })

    dispatch(
      quizAnswerActions.set({
        ...quizAnswer,
        ...{ itemAnswers },
      }),
    )
  }

  const handleTextDataChange = itemId => handleDataChange(itemId, "textData")

  const handleIntDataChange = itemId => handleDataChange(itemId, "intData")

  const handleCheckboxToggling = itemId => optionId => () => {
    const itemAnswers = quizAnswer.itemAnswers
    const itemAnswer = itemAnswers.find(ia => ia.quizItemId === itemId)

    const currentOptionValue = itemAnswer.optionAnswers.find(
      oa => oa.quizOptionId === optionId,
    )

    const newItemAnswer = {
      ...itemAnswer,
      optionAnswers: currentOptionValue
        ? itemAnswer.optionAnswers.filter(oa => oa.quizOptionId !== optionId)
        : itemAnswer.optionAnswers.concat({ quizOptionId: optionId }),
    }

    dispatch(
      quizAnswerActions.set({
        ...quizAnswer,
        itemAnswers: itemAnswers.map(ia =>
          ia.quizItemId === itemId ? newItemAnswer : ia,
        ),
      }),
    )
  }

  const handleOptionChange = itemId => optionId => () => {
    const multi = quiz.items.find(item => item.id === itemId).multi
    const itemAnswers = quizAnswer.itemAnswers.map(itemAnswer => {
      if (itemAnswer.quizItemId === itemId) {
        const updated = { ...itemAnswer }
        if (multi) {
          if (updated.optionAnswers.find(oa => oa.quizOptionId === optionId)) {
            updated.optionAnswers = updated.optionAnswers.filter(
              oa => oa.quizOptionId !== optionId,
            )
          } else {
            updated.optionAnswers = [
              ...updated.optionAnswers,
              { quizOptionId: optionId },
            ]
          }
        } else {
          updated.optionAnswers = [{ quizOptionId: optionId }]
        }
        return updated
      }
      return itemAnswer
    })
    dispatch(
      quizAnswerActions.set({
        ...quizAnswer,
        ...{ itemAnswers },
      }),
    )
  }

  const handleSubmit = useCallback(async () => {
    setSubmitLocked(true)
    const responseData = await postAnswer(quizAnswer, accessToken)

    dispatch(quizActions.set(responseData.quiz))
    dispatch(quizAnswerActions.set(responseData.quizAnswer))
    dispatch(userQuizStateActions.set(responseData.userQuizState))
  }, [])

  // not all quizzess have correct solutions - e.g. self-evaluation
  const hasCorrectAnswer = quiz => {
    return quiz.items.some(
      item =>
        item.type === "essay" ||
        item.type === "multiple-choice" ||
        item.type === "open",
    )
  }

  const atLeastOneCorrect = itemAnswers =>
    itemAnswers.some(ia => ia.correct === true)

  const submitDisabled = () => {
    const submittable = quiz.items.map(item => {
      const itemAnswer = quizAnswer.itemAnswers.find(
        ia => ia.quizItemId === item.id,
      )
      if (
        item.type === "essay" ||
        item.type === "open" ||
        item.type === "feedback"
      ) {
        if (!itemAnswer.textData) return false
        const words = wordCount(itemAnswer.textData)
        if (item.minWords && words < item.minWords) return false

        if (item.maxWords && words > item.maxWords) return false
        return true
      }
      if (item.type === "multiple-choice") {
        return itemAnswer.optionAnswers.length > 0
      }
      if (item.type === "scale") {
        return itemAnswer.intData ? true : false
      }
      if (item.type === "checkbox" || item.type === "research-agreement") {
        return itemAnswer.optionAnswers.length > 0
      }
      return undefined
    })

    return submittable.includes(false)
  }

  const quizContainsEssay = () => {
    return quiz.items.some(ia => ia.type === "essay")
  }

  const quizItemComponents = (quiz, languageId, accessToken) => {
    return (
      <>
        {quiz.items
          .sort((i1, i2) => i1.order - i2.order)
          .map(item => {
            const itemAnswer = quizAnswer.itemAnswers.find(
              ia => ia.quizItemId === item.id,
            )
            const ItemComponent = componentType(item.type)

            return (
              <ItemComponent
                item={item}
                key={item.id}
                languageInfo={languageLabels(languageId, item.type)}
                intData={itemAnswer.intData}
                textData={itemAnswer.textData}
                optionAnswers={itemAnswer.optionAnswers}
                // multi={item.multi}
                singleItem={quiz.items.length === 1}
                correct={itemAnswer.correct}
                // successMessage={item.texts[0].successMessage}
                // failureMessage={item.texts[0].failureMessage}
                peerReviewsGiven={
                  userQuizState ? userQuizState.peerReviewsGiven : 0
                }
                // peerReviewsRequired={quiz.course.minPeerReviewsGiven}
                // itemTitle={item.texts[0].title}
                // itemBody={item.texts[0].body}
                //  options={item.options}
                //  peerReviewQuestions={quiz.peerReviewCollections}
                //  submitMessage={quiz.texts[0].submitMessage}
                handleTextDataChange={handleTextDataChange(item.id)}
                handleIntDataChange={handleIntDataChange(item.id)}
                handleOptionChange={handleOptionChange(item.id)}
                handleCheckboxToggling={handleCheckboxToggling(item.id)}
                setUserQuizState={setUserQuizState}
              />
            )
          })}
      </>
    )
  }

  if (!accessToken) {
    return <div>Kirjaudu sisään vastataksesi tehtävään</div>
  }

  if (error) {
    return (
      <div>
        Error
        <pre>{error}</pre>
      </div>
    )
  }

  if (!quizAnswer || !quiz) {
    return <div>Loading...</div>
  }

  const types = quiz.items.map(item => item.type)

  if (quiz.texts.length === 0) {
    return <div>Error: quiz has no texts.</div>
  }

  return (
    <div>
      <Typography variant="h5" style={{ paddingBottom: 10 }}>
        {quiz.texts[0].title}
      </Typography>
      <Typography
        variant="body1"
        style={{ paddingBottom: 10 }}
        dangerouslySetInnerHTML={{ __html: quiz.texts[0].body }}
      />

      <div>
        {quizContainsEssay() && <StageVisualizer />}

        {quizItemComponents(quiz, languageId, accessToken)}

        {quizAnswer.id ? (
          <>
            {quizContainsEssay() && (
              <PeerReviews languageInfo={languageLabels(languageId, "essay")} />
            )}

            <Typography variant="h5">
              {hasCorrectAnswer(quiz)
                ? atLeastOneCorrect(quizAnswer.itemAnswers)
                  ? quiz.items.length === 1
                    ? "Tehtävä oikein"
                    : `Sait ${
                        quizAnswer.itemAnswers.filter(ia => ia.correct === true)
                          .length
                      }/${quiz.items.length} oikein`
                  : types.includes("essay") || types.includes("scale")
                  ? ""
                  : "Tehtävä väärin"
                : "Olet jo vastannut"}
            </Typography>
          </>
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              disabled={submitLocked ? true : submitDisabled()}
              onClick={handleSubmit}
            >
              Vastaa
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuncQuizImpl
