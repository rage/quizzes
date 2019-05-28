import React from "react"
import ExpandedMultipleChoiceItem from "./ExpandedMultipleChoiceItem"
import ShortMultipleChoiceItem from "./ShortMultipleChoiceItem"

class MultipleChoiceItem extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]
    if (item.id && !this.props.expanded) {
      return <ShortMultipleChoiceItem {...this.props} />
    } else {
      return <ExpandedMultipleChoiceItem {...this.props} />
    }
  }
}

export default MultipleChoiceItem
