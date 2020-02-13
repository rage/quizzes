import React from "react"
import { IQuizItem, QuizItemType } from "../../interfaces"
import ExpandedMultipleChoiceItem from "./ExpandedMultipleChoiceItem"
import ShortMultipleChoiceItem from "./ShortMultipleChoiceItem"

interface IMultipleChoiceItemProps {
  expanded: boolean
  items: IQuizItem[]
  order: number
  type: QuizItemType
  index: number
  save: any
  toggleExpand: any
  onCancel: any
  changeAttr: any
  updateMultipleOptions: any
}

const MultipleChoiceItem: React.FunctionComponent<IMultipleChoiceItemProps> = (
  props: any,
) => {
  const { expanded, ...expandedProps } = props

  if (!expanded) {
    return <ShortMultipleChoiceItem {...props} />
  } else {
    return <ExpandedMultipleChoiceItem {...expandedProps} />
  }
}

export default MultipleChoiceItem
