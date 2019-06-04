import React from "react"
import ExpandedCustomType from "./ExpandedCustomType"
import ShortCustomType from "./ShortCustomType"

class CustomType extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]
    if (item.id && !this.props.expanded) {
      return <ShortCustomType {...this.props} />
    } else {
      return <ExpandedCustomType {...this.props} />
    }
  }
}

export default CustomType
