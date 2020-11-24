import * as React from "react"
import styled from "styled-components"

const Message = styled.p`
  margin: auto;
  width: auto;
  height 100px;
  padding-top: 40px;
  font-size: 2.5rem;
  text-align: center;
`

class SimpleErrorBoundary extends React.Component<any, any> {
  state = {
    error: null,
    stack: null,
  }
  static getDerivedStateFromError(error: any) {
    return { error: error.toString(), stack: error.stack }
  }

  componentDidCatch(error: any, info: any) {
    console.error(error, info)
  }

  render() {
    if (this.state.error) {
      return <Message>Something went wrong</Message>
    }

    return this.props.children
  }
}

export default SimpleErrorBoundary
