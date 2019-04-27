import React, { ComponentClass } from "react"
import { SortableElement } from "react-sortable-hoc"

const SortableWrapper: ComponentClass<any, any> = SortableElement(
  (props: any) => <React.Fragment>{props.children}</React.Fragment>,
)

export default SortableWrapper
