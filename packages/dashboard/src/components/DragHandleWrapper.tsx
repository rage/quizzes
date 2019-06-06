import React from "react"
import { SortableHandle } from "react-sortable-hoc"

const DragHandleWrapper = SortableHandle((props: any) => (
  <React.Fragment>{props.children}</React.Fragment>
))

export default DragHandleWrapper
