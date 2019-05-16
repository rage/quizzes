import { Checkbox, Grid, IconButton, TextField } from "@material-ui/core"
import Clear from "@material-ui/icons/Clear"
import React from "react"
import { SortableContainer } from "react-sortable-hoc"
import SortableWrapper from "../SortableWrapper"

const SortableCheckboxList = SortableContainer((props: any) => {
  return (
    <Grid item={true} xs={12}>
      {props.options.map((optionData, index) => {
        return (
          <SortableWrapper
            collection={"options"}
            index={index}
            key={`${index}-${optionData.title}`}
          >
            <Grid
              item={true}
              xs={12}
              key={optionData.order}
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
                    value={
                      (optionData.titleHasBeenModified && optionData.title) ||
                      ""
                    }
                    onChange={props.changeTempOptionAttribute(
                      optionData.order,
                      "title",
                    )}
                  />

                  <TextField
                    fullWidth={true}
                    multiline={true}
                    label="Option body"
                    value={optionData.body || ""}
                    onChange={props.changeTempOptionAttribute(
                      optionData.order,
                      "body",
                    )}
                  />
                </Grid>

                {props.options.length > 1 && (
                  <Grid item={true} xs={2} md={1}>
                    <IconButton onClick={props.onRemove(optionData.order)}>
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
})

export default SortableCheckboxList
