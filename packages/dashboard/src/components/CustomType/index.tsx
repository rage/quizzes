import React from "react"
import ExpandedCustomType from "./ExpandedCustomType"
import ShortCustomType from "./ShortCustomType"

class CustomType extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    if (!this.props.expanded) {
      return <ShortCustomType {...this.props} />
    } else {
      return <ExpandedCustomType {...this.props} />
    }
  }
}

export default CustomType
