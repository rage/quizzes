import { Button } from "@material-ui/core"
import * as React from "react"

class CourseDuplicateButton extends React.Component<Any, Any> {
  public render() {
    return (
      <Button
        variant="contained"
        style={{
          borderRadius: "0px",
          backgroundColor: "#107EAB",
          color: "white",
        }}
      >
        Duplicate
      </Button>
    )
  }
}

export default CourseDuplicateButton
