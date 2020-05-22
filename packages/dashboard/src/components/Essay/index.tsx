import React from "react"
import ExpandedEssay from "./ExpandedEssay"
import ShortEssay from "./ShortEssay"

class EssayItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]
    if (!item) {
      return <p />
    }
    if (!this.props.expanded) {
      return <ShortEssay {...this.props} />
    } else {
      return <ExpandedEssay {...this.props} />
    }
  }
}

export default EssayItem
