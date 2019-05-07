import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core"
import Create from "@material-ui/icons/Create"
import React from "react"
import DragHandleWrapper from "../DragHandleWrapper"

class ScaleItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]

    const minimum = item.minWords || 1
    const maximum = item.maxWords || 7
    console.log("Props inside the scale item: ", this.props)
    return (
      <Grid
        container={true}
        spacing={16}
        justify="center"
        alignItems="center"
        style={{ marginTop: "2em", marginBottom: "2em" }}
      >
        <DragHandleWrapper>
          <Grid item={true} xs={12} sm={10} lg={8}>
            <Grid
              container={true}
              spacing={16}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item={true} xs={6} md={3} lg={2}>
                <Typography variant="title">{item.texts[0].title}</Typography>
              </Grid>

              <Grid item={true} xs={6} md={9} lg={10}>
                <RadioGroup row={true} aria-label="agreement" name="agreement">
                  {Array.from(
                    new Array(maximum - minimum + 1),
                    (x, i) => i + minimum,
                  ).map(n => (
                    <FormControlLabel
                      key={n}
                      value={`${n}`}
                      control={<Radio disabled={true} />}
                      label={`${n}`}
                      labelPlacement="start"
                    />
                  ))}
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>

          <Grid item={true} xs={1}>
            <IconButton
              aria-label="Add option"
              color="primary"
              disableRipple={true}
              onClick={this.props.toggleExpand}
            >
              <Create fontSize="large" nativeColor="#B5B5B5" />
            </IconButton>
          </Grid>
        </DragHandleWrapper>
      </Grid>
    )
  }
}

export default ScaleItem
