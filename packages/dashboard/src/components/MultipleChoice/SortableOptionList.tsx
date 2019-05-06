import { Button, Grid, IconButton, Typography } from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import React from "react"
import { SortableContainer } from "react-sortable-hoc"
import DragHandleWrapper from "../DragHandleWrapper"
import SortableWrapper from "../SortableWrapper"

const SortableOptionList = SortableContainer((props: any) => {
  return (
    <Grid
      container={true}
      spacing={16}
      justify="space-evenly"
      alignItems="stretch"
    >
      {props.options.map((option, index) => (
        <SortableWrapper
          collection={`items[${props.order}].options`}
          index={index}
          key={`${option.quizItemId}-${index}-${option.texts[0].title}`}
        >
          <Grid item={true} xs="auto" style={{ 
            textAlign: "center",
            border: "dotted",
            borderColor: option.correct ? "green" : "red",
            cursor: "pointer"
         }}
         onClick={props.modifyExistingOption(option.id, option.quizItemId)}
         >

               <Typography 
             
               >
                  { option.texts[0].title }
               </Typography>
 
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
