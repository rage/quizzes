import React from "react"
import ExpandedScale from "./ExpandedScale"

import ShortScale from "./ShortScale"

class ScaleItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]
    if (item.id && !this.props.expanded) {
      return <ShortScale {...this.props} />
    } else {
      return <ExpandedScale {...this.props} />
    }
  }
}

export default ScaleItem
