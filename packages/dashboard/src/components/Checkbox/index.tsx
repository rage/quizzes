import React from "react"
import ExpandedCheckbox from "./ExpandedCheckbox"
import ShortCheckbox from "./ShortCheckbox"

class CheckBox extends React.Component<any, any> {
  public render() {
    if (!this.props.expanded) {
      return <ShortCheckbox {...this.props} />
    } else {
      return <ExpandedCheckbox {...this.props} />
    }
  }
}

export default CheckBox
