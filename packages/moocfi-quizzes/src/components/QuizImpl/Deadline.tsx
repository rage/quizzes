import * as React from "react"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-solid-svg-icons"

const StyledDeadlineText = styled(Typography)`
  padding: 0.25rem 0 1rem 0;
  color: rgb(108, 117, 125);
  font-size: 0.9rem;
  font-weight: bold;
`

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 1rem;
  margin-right: 0.25em;
  vertical-align: -0.1em;
`

interface IDeadlineProps {
  deadline?: Date
}

const Deadline: React.FunctionComponent<IDeadlineProps> = ({ deadline }) => {
  if (!deadline) {
    return <></>
  }

  return (
    <StyledDeadlineText>
      <StyledIcon icon={faClock} />
      {`Deadline: ${deadline.toLocaleString()}`}
    </StyledDeadlineText>
  )
}

export default Deadline
