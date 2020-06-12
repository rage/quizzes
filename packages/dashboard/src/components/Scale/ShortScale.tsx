import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core"
import React from "react"
import { IQuizItem } from "../../interfaces"
import ShortWrapper from "../ItemTools/ShortWrapper"

interface IShortScaleProps {
  items: IQuizItem[]
  order: number
  toggleExpand: () => void
}

const ShortScale: React.FunctionComponent<IShortScaleProps> = (props) => {
  const item = props.items[props.order]

  const minimum = item.minValue || 1
  const maximum = item.maxValue || 7
  return (
    <ShortWrapper toggleExpand={props.toggleExpand}>
      <Grid
        container={true}
        spacing={3}
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
                  xs={item.maxValue - item.minValue > 5 ? 10 : 2}
                />
                <Grid item={true} xs="auto">
                  <Typography>{item.texts[0].failureMessage}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
        <Grid item={true} xs={6}>
          <Typography variant="h6">{item.texts[0].title}</Typography>
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
            ).map((n) => (
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
    </ShortWrapper>
  )
}

export default ShortScale
