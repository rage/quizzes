import { Checkbox, Grid, Typography } from "@material-ui/core"
import React from "react"
import ShortWrapper from "../ItemTools/ShortWrapper"

const ShortCheckbox = props => {
  const item = props.items[props.order]

  return (
    <ShortWrapper toggleExpand={props.toggleExpand}>
      <Grid
        container={true}
        spacing={16}
        justify="flex-start"
        alignItems="center"
      >
        <Grid item={true} xs={6} xl={4}>
          <Typography variant="title">
            {item.texts[0].title} ({item.type})
          </Typography>
        </Grid>
        <Grid item={true} xs={6} xl={8}>
          <Grid
            container={true}
            spacing={0}
            justify="flex-start"
            alignItems="center"
          >
            <Grid item={true} xs="auto">
              <Checkbox disabled={true} color="primary" />
            </Grid>

            <Grid item={true} xs="auto">
              <Typography variant="subtitle1">
                {item.options[0].texts[0].title}
              </Typography>

              {item.options[0].texts[0].body && (
                <Typography variant="body1">
                  {item.options[0].texts[0].body}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ShortWrapper>
  )
}

export default ShortCheckbox
