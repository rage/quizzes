import React, { ComponentClass } from 'react'
import { SortableElement } from 'react-sortable-hoc'

const SortableWrapper: ComponentClass<any, any> = SortableElement((props: any) => <div>{props.children}</div>)

export default SortableWrapper