import React from "react"
import { IQuizItem, QuizItemType } from "../../interfaces"
import ExpandedScale from "./ExpandedScale"
import ShortScale from "./ShortScale"

export interface IScaleItemProps {
  changeAttr: (attribute: string, newValue: any) => void
  order: number
  items: IQuizItem[]
  type: QuizItemType
  toggleExpand: () => void
  onCancel: () => void
  expanded: boolean
}

const ScaleItem: React.FunctionComponent<IScaleItemProps> = props => {
  if (!props.expanded) {
    return <ShortScale {...props} />
  } else {
    return <ExpandedScale {...props} />
  }
}

export default ScaleItem
