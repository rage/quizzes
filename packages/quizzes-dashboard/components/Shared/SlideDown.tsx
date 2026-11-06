import React from "react"
import { Slide } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions"

export const SlideDown = (
  props: TransitionProps & { children: React.ReactElement },
) => <Slide {...props} direction="down" />
