import * as React from 'react'

class ExampleErrorBoundary extends React.Component<any, any> {
  state = {
    error: null,
    stack: null
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
        <div>
          <h2>Crash:</h2>
          <p>{this.state.error}</p>
          {this.state.stack && <pre>{this.state.stack}</pre>}
        </div>
      )
    }

    return this.props.children
  }
}

export default ExampleErrorBoundary
