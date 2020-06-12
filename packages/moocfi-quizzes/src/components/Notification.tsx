import * as React from "react"
import styled from "styled-components"
import { useTypedSelector } from "../state/store"
import { scrollToRef } from "../utils"

const Message = styled.div<{ msgColor: string | null }>`
  ${({ msgColor }) => `
  display: flex
  border-style: solid;
  border-width: 0.25rem;
  border-color: ${msgColor}
  padding: 1rem 0;
  p {
    margin: auto;
    color: ${msgColor};
    font-size: 1.25rem;
    font-weight: bold;
  }
  `}
`

const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`

interface NotificationProps {
  scrollRef: any
}

const Notification: React.FunctionComponent<NotificationProps> = ({
  scrollRef,
}) => {
  const messageState = useTypedSelector((state) => state.message)
  if (messageState.message) {
    const color = (messageState.error && "red") || null
    scrollToRef(scrollRef)
    return (
      <Message msgColor={color}>
        <p>{messageState.message}</p>
      </Message>
    )
  }
  return null
}

export default Notification
