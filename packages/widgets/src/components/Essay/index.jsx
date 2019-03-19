import React, { Component } from "react"
import StageSelector from "./StageSelector"
import StageVisualizer from "./StageVisualizer"

export default props => {
  return (
    <div>
      <StageVisualizer {...props} />
      <StageSelector {...props} />
    </div>
  )
}
