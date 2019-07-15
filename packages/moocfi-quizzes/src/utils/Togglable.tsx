import * as React from "react"
import Button from "@material-ui/core/Button"

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
      <Button variant="outlined" color="default" onClick={toggle}>
        {toggled ? hideButtonText : displayButtonText}
      </Button>
      {toggled && children}
    </React.Fragment>
  )
}

export default Togglable
