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

const ShortScale = props => {
  const item = props.items[props.order]

  const minimum = item.minWords || 1
  const maximum = item.maxWords || 7
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
            {(item.texts[0].failureMessage || item.texts[0].successMessage) && (
              <React.Fragment>
                <Grid item={true} xs={6} />
                <Grid item={true} xs={6}>
                  <Grid container={true} justify="center" alignItems="center">
                    <Grid item={true} xs="auto">
                      <Typography>{item.texts[0].successMessage}</Typography>
                    </Grid>
                    <Grid
                      item={true}
                      xs={item.maxWords - item.minWords > 5 ? 10 : 2}
                    />
                    <Grid item={true} xs="auto">
                      <Typography>{item.texts[0].failureMessage}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
            <Grid item={true} xs={6}>
              <Typography variant="title">{item.texts[0].title}</Typography>
            </Grid>

            <Grid item={true} xs={6}>
              <RadioGroup
                row={true}
                aria-label="agreement"
                name="agreement"
                style={{ justifyContent: "center" }}
              >
                {Array.from(
                  new Array(maximum - minimum + 1),
                  (x, i) => Number(i) + Number(minimum),
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
            aria-label="Modify scale item"
            color="primary"
            disableRipple={true}
            onClick={props.toggleExpand}
          >
            <Create fontSize="large" nativeColor="#B5B5B5" />
          </IconButton>
        </Grid>
      </DragHandleWrapper>
    </Grid>
  )
}

export default ShortScale
