import * as React from "react"
import styled from "styled-components"
import { LeftBorderedDivProps } from "../../../src/components/MultipleChoice"

const Container = styled.div<LeftBorderedDivProps>``

export default props => {
  return (
    <Container correct={props.correct}>
      <div>
        <p>{props.message}</p>
      </div>
      <div>{props.children}</div>
    </Container>
  )
}
