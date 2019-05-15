import React from "react"
import ExpandedCheckBox from "./ExpandedCheckbox"
import ShortCheckBox from "./ShortCheckbox"

class CheckBox extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
    if (this.state.expanded) {
      return <ExpandedCheckBox />
    } else {
      return <ShortCheckBox />
    }
  }
}

export default CheckBox
