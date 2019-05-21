import { Button, Grid, IconButton, Typography } from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import React from "react"
import { SortableContainer } from "react-sortable-hoc"
import { stringContainsLongerWord } from "../../../../common/src/util/index"
import SortableWrapper from "../SortableWrapper"

const SortableOptionList = SortableContainer((props: any) => {
  return (
    <Grid
      container={true}
      spacing={16}
      justify="space-evenly"
      alignItems="center"
    >
      {props.options.map((option, index) => {
        return (
          <SortableWrapper
            collection={`items[${props.order}].options`}
            index={index}
            key={`${option.quizItemId}-${index}-${option.title}`}
          >
            <Grid item={true} xs={12} sm={6} md={4} lg={3}>
              <div
                style={{
                  border: "dotted",
                  borderColor: option.correct ? "green" : "red",
                  cursor: "pointer",
                  padding: ".5em",
                  textAlign: "center",
                  wordBreak: stringContainsLongerWord(option.title, 30)
                    ? "break-all"
                    : "normal",
                }}
                onClick={props.modifyExistingOption(option.order)}
              >
                <Typography variant="body1">{option.title || ""}</Typography>
              </div>
            </Grid>
          </SortableWrapper>
        )
      })}
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
