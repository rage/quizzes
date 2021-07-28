import { denormalize, normalize } from "normalizr"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { v4 } from "uuid"
import StatelessEditor from "../../components/StatelessEditor"
import { normalizedQuiz } from "../../schemas"
import { initializedEditor } from "../../store/editor/editorActions"
import { storeState, useTypedSelector } from "../../store/store"
import {
  Item,
  PrivateSpecItem,
  PrivateSpecOption,
  PublicSpecItem,
  PublicSpecOption,
  Quiz,
} from "../../types/Quiz"

const Stateless: React.FC = () => {
  const dispatch = useDispatch()
  const store = useTypedSelector(state => state)
  const [port, setPort] = useState<MessagePort | null>(null)

  useEffect(() => {
    if (!port) {
      return
    }
    port.postMessage({
      message: "current-state",
      data: convertStoreToSpecs(store),
    })
  }, [store])

  useEffect(() => {
    const handler = (message: WindowEventMap["message"]) => {
      if (message.source !== parent) {
        return
      }
      const port = message.ports[0]
      if (port) {
        console.log("Frame received a port:", port)
        setPort(port)
        port.onmessage = (message: WindowEventMap["message"]) => {
          console.log(
            "Frame received a message from port",
            JSON.stringify(message.data),
          )
          const data = message.data
          if (data.message === "set-state") {
            console.log("Frame: setting state from message")
            console.log(data)
            dispatch(initializedEditor(normalizeData(data.data), data.data))
          } else {
            console.error("Frame received an unknown message from message port")
          }
        }
      }
    }
    console.log("frame adding event listener")
    addEventListener("message", handler)
    // target origin is *, beacause this is a sandboxed iframe without the
    // allow-same-origin permission
    parent.postMessage("ready", "*")

    // cleanup function
    return () => {
      console.log("removing event listener")
      removeEventListener("message", handler)
    }
  }, [store])

  if (!store) {
    return <>Waiting for content...</>
  }

  if (!port) {
    return <>Waiting for port...</>
  }

  return <StatelessEditor onHeightChange={onHeightChange} port={port} />
}

const onHeightChange = (newHeight: number, port: MessagePort) => {
  port.postMessage({
    message: "height-changed",
    data: newHeight,
  })
}

const normalizeData = (data: any) => {
  const normalizedInputData = normalize(
    data === null ? emptyQuiz : data,
    normalizedQuiz,
  )
  return {
    quizzes: normalizedInputData.entities.quizzes ?? {},
    items: normalizedInputData.entities.items ?? {},
    options: normalizedInputData.entities.options ?? {},
    result: normalizedInputData.result ?? "",
    peerReviewCollections:
      normalizedInputData.entities.peerReviewCollections ?? {},
    questions: normalizedInputData.entities.questions ?? {},
  }
}
interface QuizzesSpecs {
  private_spec: Quiz
  public_spec: { id: string; items: PublicSpecItem[] }
}

const convertStoreToSpecs = (store: storeState): QuizzesSpecs => {
  const denormalizedData = denormalizeData(store)

  const specs: QuizzesSpecs = {
    private_spec: denormalizeData(store),
    public_spec: {
      id: v4(),
      items: denormalizedData.items.map(i => {
        const publicItem: PublicSpecItem = {
          formatRegex: i.formatRegex,
          multi: i.multi,
          id: i.id,
          body: i.body,
          direction: i.direction,
          maxLabel: i.maxLabel,
          maxValue: i.maxValue,
          maxWords: i.maxWords,
          minLabel: i.minLabel,
          minValue: i.minValue,
          minWords: i.minWords,
          order: i.order,
          title: i.title,
          type: i.type,
          options: i.options.map(o => {
            const publicOption: PublicSpecOption = {
              id: o.id,
              body: o.body,
              order: o.order,
              title: o.title,
              quizItemId: o.quizItemId,
            }
            return publicOption
          }),
        }
        return publicItem
      }),
    },
  }
  return specs
}

const denormalizeData = (store: storeState): Quiz => {
  let quizData = {
    quizzes: store.editor.quizzes,
    items: store.editor.items,
    options: store.editor.options,
    quizId: store.editor.quizId,
    peerReviewCollections: store.editor.peerReviewCollections,
    questions: store.editor.questions,
  }
  return denormalize(quizData.quizId, normalizedQuiz, quizData)
}

const emptyQuiz: Quiz = {
  id: v4(),
  autoConfirm: true,
  autoReject: false,
  awardPointsEvenIfWrong: true,
  body: "",
  courseId: v4(),
  createdAt: new Date(),
  deadline: new Date(),
  excludedFromScore: true,
  grantPointsPolicy: "",
  items: [],
  part: 0,
  peerReviewCollections: [],
  points: 0,
  section: 0,
  submitMessage: "",
  title: "",
  tries: 1,
  triesLimited: true,
  updatedAt: new Date(),
  open: new Date(),
}

// @ts-ignore
Stateless.noLayout = true

export default Stateless
