import React, { ComponentClass } from 'react'
import { SortableHandle } from 'react-sortable-hoc'

const DragHandleWrapper = SortableHandle((props: any) => <div>{props.children}</div>)

export default DragHandleWrapper