import * as React from "react"
import { BaseButton } from "../components/styleComponents"

export interface TogglableProps {
  initiallyVisible: boolean
  hideButtonText: string
  displayButtonText: string
}

const Togglable: React.FunctionComponent<TogglableProps> = ({
  initiallyVisible,
  hideButtonText,
  displayButtonText,
  children,
}) => {
  const [toggled, setToggled] = React.useState(initiallyVisible)
  const toggle = () => setToggled(!toggled)

  return (
    <React.Fragment>
      <BaseButton variant="outlined" color="default" onClick={toggle}>
        {toggled ? hideButtonText : displayButtonText}
      </BaseButton>
      {toggled && children}
    </React.Fragment>
  )
}

export default Togglable
