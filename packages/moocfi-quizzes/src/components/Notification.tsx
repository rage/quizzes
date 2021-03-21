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
  text-align: center;
  margin: 0 auto;
  width: 50%;
  margin-bottom: 1rem;
  p {
    margin: auto;
    padding: .4rem 0;
    color: ${msgColor};
    font-size: .8rem;
    font-weight: 500;
    font-family: Poppins;
    border-left: 3px solid red;
    background: #ECF6FB;

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
  const messageState = useTypedSelector(state => state.message)
  if (messageState.message) {
    const color = (messageState.error && "#F76D82") || "#333"
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
