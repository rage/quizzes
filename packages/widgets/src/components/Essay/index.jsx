import React, { Component } from "react"
import StageSelector from "./StageSelector"
import StageVisualizer from "./StageVisualizer"

export default props => {
  return (
    <div>
      {(props.item.texts[0].title || props.item.texts[0].body) && (
        <div>
          <h2>{props.item.texts[0].title}</h2>
          {props.item.texts[0].body}
        </div>
      )}

      <StageVisualizer {...props} />
      <StageSelector {...props} />
    </div>
  )
}
