import * as React from "react"
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../modelTypes"

type UnsupportedProps = {
  item: QuizItem
}

export default ({ item }: UnsupportedProps) => {
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )
  if (!languageLabels) {
    return <div />
  }
  const unsupportedLabels = languageLabels.unsupported
  return <div>{unsupportedLabels.notSupportedInsert(item.type)}</div>
}
