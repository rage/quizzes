import { Button, Grid, IconButton, Typography } from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import React from "react"
import { SortableContainer } from "react-sortable-hoc"
import { IQuizItemOption } from "../../interfaces"
import { stringContainsLongerWord } from "../../util/index"
import SortableWrapper from "../SortableWrapper"

interface ISortableOptionListProps {
  options: IQuizItemOption[]
  order: number
  createNewOption: () => void
  openOptionDialog: (optionIdx: number) => any
}

const SortableOptionList = SortableContainer<ISortableOptionListProps>(
  props => {
    console.log(
      "Sortable option list is rendered with the following props:",
      props,
    )

    return (
      <Grid
        container={true}
        spacing={3}
        justify="space-evenly"
        alignItems="center"
      >
        {props.options.map((option, index) => {
          return (
            <SortableWrapper
              collection={`items[${props.order}].options`}
              index={index}
              key={`${option.quizItemId}-${index}-${option.texts[0].title}`}
            >
              <Grid item={true} xs={12} sm={6} md={4} lg={3}>
                <div
                  style={{
                    border: "dotted",
                    borderColor: option.correct ? "green" : "red",
                    cursor: "pointer",
                    padding: ".5em",
                    textAlign: "center",
                    wordBreak: stringContainsLongerWord(
                      option.texts[0].title,
                      30,
                    )
                      ? "break-all"
                      : "normal",
                  }}
                  onClick={props.openOptionDialog(index)}
                >
                  <Typography variant="body1">
                    {option.texts[0].title || ""}
                  </Typography>
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
            <AddCircle component="svg" fontSize="large" htmlColor="#E5E5E5" />
          </IconButton>
        </Grid>
      </Grid>
    )
  },
)

export default SortableOptionList
