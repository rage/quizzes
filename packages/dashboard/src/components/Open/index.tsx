import React from "react"
import ExpandedOpen from "./ExpandedOpen"
import ShortOpen from "./ShortOpen"

class Open extends React.Component<any, any> {
  public render() {
    if (!this.props.expanded) {
      return <ShortOpen {...this.props} />
    } else {
      return <ExpandedOpen {...this.props} />
    }
  }
}

export default Open
