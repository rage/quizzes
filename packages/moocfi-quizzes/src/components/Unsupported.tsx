import * as React from "react"
import { QuizItem } from "../state/quiz/reducer"
import { useTypedSelector } from "../state/store"

type UnsupportedProps = {
  item: QuizItem
}

export default ({ item }: UnsupportedProps) => {
  const unsupportedLabels = useTypedSelector(
    state => state.language.languageLabels.unsupported,
  )
  return <div>{unsupportedLabels.notSupportedInsert(item.type)}</div>
}
