import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core"
import Create from "@material-ui/icons/Create"
import React from "react"
import DragHandleWrapper from "../DragHandleWrapper"
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
