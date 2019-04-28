import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import Reorder from "@material-ui/icons/Reorder"
import React from "react"
import { SortableContainer } from "react-sortable-hoc"
import SortableWrapper from "./SortableWrapper"

const SortableOptionList = SortableContainer((props: any) => {
  return (
    <Grid
      container={true}
      spacing={24}
      justify="flex-start"
      alignItems="center"
    >
      {props.items.map((option, index) => (
        <SortableWrapper
          collection={`items[${props.order}].options`}
          index={index}
          key={`${option.quizItemId}-${index}`}
        >
          <Grid
            item={true}
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={2}
            style={{ textAlign: "center" }}
          >
            <Button
              variant="outlined"
              style={{
                borderColor: option.correct ? "green" : "red",
                borderStyle: "dotted",
                borderWidth: ".25em",
                textTransform: "none",
              }}
              onClick={props.modifyExistingOption(option.id, option.quizItemId)}
            >
              {option.texts[0].title}
            </Button>
          </Grid>
        </SortableWrapper>
      ))}
      <Grid item={true} xs="auto">
        <IconButton
          aria-label="Add option"
          color="primary"
          disableRipple={true}
          onClick={props.createNewOption}
        >
          <AddCircle fontSize="large" nativeColor="#E5E5E5" />
        </IconButton>
      </Grid>
    </Grid>
  )
})

export default SortableOptionList
