import * as React from "react"
import { useRef, useState } from "react"
import styled from "styled-components"
import { scrollToRef } from "./"
import { BaseButton } from "../components/styleComponents"

export interface TogglableProps {
  initiallyVisible: boolean
  hideButtonText: string
  displayButtonText: string
  scrollRef?: any
}

const ToggleButton = styled(BaseButton)`
  margin-top: 1rem;
`

const Togglable: React.FunctionComponent<TogglableProps> = ({
  initiallyVisible,
  hideButtonText,
  displayButtonText,
  children,
  scrollRef,
}) => {
  const ref = useState(useRef(null))[0]
  const [toggled, setToggled] = useState(initiallyVisible)
  const toggle = () => {
    setToggled(!toggled)
    toggled ? scrollRef && scrollToRef(scrollRef) : scrollToRef(ref)
  }

  return (
    <React.Fragment>
      <div ref={ref} />
      <ToggleButton variant="outlined" color="default" onClick={toggle}>
        {toggled ? hideButtonText : displayButtonText}
      </ToggleButton>
      {toggled && children}
    </React.Fragment>
  )
}

export default Togglable
