import * as React from "react"
import { QuizItem } from "../state/quiz/reducer"

type UnsupportedProps = {
  item: QuizItem
}

export default ({ item }: UnsupportedProps) => (
  <div>{`Question of type '${item.type}' is not supported yet`}</div>
)
