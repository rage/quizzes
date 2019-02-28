import React, { Component } from "react"
import { Button } from "@material-ui/core"
import Essay from "./Essay"
import MultipleChoice from "./MultipleChoice"

const mapTypeToComponent = {
  essay: Essay,
  "multiple-choice": MultipleChoice,
}

class Quiz extends Component {
  state = {
    data: undefined,
  }

  async componentDidMount() {
    const { id, accessToken } = this.props
    // fetch
    this.setState({
      data: {
        items: [{ type: "multiple-choice" }],
      },
    })
  }

  render() {
    if (!this.state.data) {
      return <div>Loading</div>
    }
    return (
      <div>
        {this.state.data.items.map(item => {
          const ItemComponent = mapTypeToComponent[item.type]
          return (
            <div>
              <ItemComponent />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Quiz
