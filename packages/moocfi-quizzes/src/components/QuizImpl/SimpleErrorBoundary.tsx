import * as React from "react"
import styled from "styled-components"

const Message = styled.div`
  margin: auto;
  width: 100%;
  padding: 2rem;
  h2 {
    font-size: 2rem;
    text-align: center;
    margin-top: 0;
  }
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
      return (
        <Message>
          <h2>Something went wrong</h2>
          <p>{this.state.error}</p>
          <pre>{this.state.stack}</pre>
        </Message>
      )
    }

    return this.props.children
  }
}

export default SimpleErrorBoundary
