import { Button, Grid, IconButton } from "@material-ui/core"
import Flag from "@material-ui/icons/Flag"
import React from "react"

const LanguageBar = props => {
  return (
    <Grid item={true} xs={12} style={{ backgroundColor: "#F8F8F8" }}>
      <Grid container={true} justify="space-between">
        <Grid item={true} xs="auto">
          {/*
                                  }
            <IconButton>
              <Flag />
            </IconButton>
            <IconButton>
              <Flag />
            </IconButton>
            <IconButton>
              <Flag />
            </IconButton>
                  */}
          <Button>FI</Button>
          <Button>EN</Button>
          <Button>SWE</Button>
        </Grid>
        <Grid item={true} xs="auto">
          <Button
            variant="text"
            style={{
              borderRadius: "0px",
              backgroundColor: "#107EAB",
              color: "white",
            }}
          >
            Add language
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default LanguageBar
