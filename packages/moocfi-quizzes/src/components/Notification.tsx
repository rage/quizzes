import * as React from "react"
import styled from "styled-components"
import { useTypedSelector } from "../state/store"

const Message = styled.p<{ msgColor: string }>`
  color: ${({ msgColor }) => msgColor};
  font-size: 1.25rem;
  padding: 1rem 0;
`

const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`

const Notification: React.FunctionComponent = () => {
  const messageState = useTypedSelector(state => state.message)
  if (messageState.notification && messageState.notification.message) {
    return (
      <>
        <Message msgColor={messageState.notification.color}>
          {messageState.notification.message}
        </Message>
        <Break />
      </>
    )
  }
  return null
}

export default Notification
