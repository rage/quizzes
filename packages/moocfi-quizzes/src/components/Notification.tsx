import * as React from "react"
import styled from "styled-components"
import { useTypedSelector } from "../state/store"

const Message = styled.p<{ msgColor: string | null }>`
  ${({ msgColor }) => `color: ${msgColor};`}
  font-size: 1.25rem;
  padding: 1rem 0;
`

const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`

const Notification: React.FunctionComponent = () => {
  const messageState = useTypedSelector(state => state.message)
  if (messageState.message) {
    const color = (messageState.error && "red") || null
    return (
      <>
        <Message msgColor={color}>{messageState.message}</Message>
        <Break />
      </>
    )
  }
  return null
}

export default Notification
