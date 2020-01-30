import { Checkbox, Grid, IconButton, TextField } from "@material-ui/core"
import Clear from "@material-ui/icons/Clear"
import React from "react"
import { SortableContainer } from "react-sortable-hoc"
import { IQuizItemOption } from "../../interfaces"
import SortableWrapper from "../SortableWrapper"

interface ISortableCheckboxListProps {
  options: IQuizItemOption[]
  onRemove: any
  changeTempOptionAttribute: any
  itemOrder: number
  onSortEnd: any
  axis: "x" | "y" | "xy"
  distance?: number
}

const SortableCheckboxList = SortableContainer(
  (props: ISortableCheckboxListProps) => {
    return (
      <Grid item={true} xs={12}>
        {props.options.map((option, index) => {
          return (
            <SortableWrapper
              collection={"options"}
              index={index}
              key={`${index}`}
            >
              <Grid
                item={true}
                xs={12}
                key={option.order}
                style={{ marginBottom: "2em" }}
              >
                <Grid container={true} justify="flex-start" alignItems="center">
                  <Grid item={true} xs={2} md={1}>
                    <Checkbox disabled={true} color="primary" />
                  </Grid>
                  <Grid item={true} xs="auto">
                    <TextField
                      fullWidth={true}
                      multiline={true}
                      label="Option title"
                      value={option.texts[0].title || ""}
                      onChange={props.changeTempOptionAttribute(
                        option.order,
                        "title",
                      )}
                    />

                    <TextField
                      fullWidth={true}
                      multiline={true}
                      label="Option body"
                      value={option.texts[0].body || ""}
                      onChange={props.changeTempOptionAttribute(
                        option.order,
                        "body",
                      )}
                    />
                  </Grid>

                  {props.options.length > 1 && (
                    <Grid item={true} xs={2} md={1}>
                      <IconButton onClick={props.onRemove(option.order)}>
                        <Clear fontSize="large" />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </SortableWrapper>
          )
        })}
      </Grid>
    )
  },
)

export default SortableCheckboxList
