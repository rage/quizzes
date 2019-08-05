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

class MultipleChoiceItem extends React.Component<IMultipleChoiceItemProps> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]
    const { expanded, ...expandedProps } = this.props

    if (item.id && !this.props.expanded) {
      return <ShortMultipleChoiceItem {...this.props} />
    } else {
      return <ExpandedMultipleChoiceItem {...expandedProps} />
    }
  }
}

export default MultipleChoiceItem
