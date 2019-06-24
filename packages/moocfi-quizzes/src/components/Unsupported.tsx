import * as React from "react"

type UnsupportedProps = {
  item: any
}

export default ({ item }) => (
  <div>{`Question of type '${item.type}' is not supported yet`}</div>
)
