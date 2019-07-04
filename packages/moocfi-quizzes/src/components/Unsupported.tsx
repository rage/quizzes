import * as React from "react"
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../modelTypes"

type UnsupportedProps = {
  item: QuizItem
}

export default ({ item }: UnsupportedProps) => {
  const unsupportedLabels = useTypedSelector(
    state => state.language.languageLabels.unsupported,
  )
  return <div>{unsupportedLabels.notSupportedInsert(item.type)}</div>
}
