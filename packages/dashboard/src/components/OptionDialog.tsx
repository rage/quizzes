import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"

import { IQuizItem } from "../interfaces"
import { changeAttr, modifyOption } from "../store/edit/actions"

interface IOptionDialogProps {
  optionIdx: number
  isOpen: boolean
  onClose: () => void
  item: IQuizItem
  modifyOption: any
  changeAttr: any
}

const OptionDialogFunc: React.FunctionComponent<IOptionDialogProps> = (
  props,
) => {
  const options = props.item.options
  if (!options) {
    return <></>
  }
  const option = options[props.optionIdx]
  if (!option) {
    return <div />
  }

  const handleAttributeChange = (attributeName) => (e) => {
    const value = e.target.value

    const baseString = `items[${props.item.order}].options[${props.optionIdx}]`
    switch (attributeName) {
      case "title":
      case "body":
      case "failureMessage":
      case "successMessage":
        props.changeAttr(`${baseString}.texts[0].[${attributeName}]`, value)
        break
      case "correct":
        props.changeAttr(
          `${baseString}.${attributeName}`,
          !option[attributeName],
        )
        break
      default:
        break
    }
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="option-dialog-title"
    >
      <DialogTitle id="option-dialog-title">
        {option.id ? "Modify option" : "Add new multiple choice option"}
      </DialogTitle>
      <DialogContent>
        <FormGroup>
          <Grid
            container={true}
            spacing={0}
            justify="flex-start"
            alignItems="center"
          >
            <Grid
              item={true}
              xs={12}
              sm={2}
              md={1}
              style={{ paddingRight: "5px" }}
            >
              <Typography variant="subtitle1">Text</Typography>
            </Grid>
            <Grid item={true} xs={12} sm={10} md={11}>
              <TextField
                variant="outlined"
                fullWidth={true}
                multiline={true}
                placeholder="Text"
                value={option.texts[0].title || ""}
                onChange={handleAttributeChange("title")}
              />
            </Grid>
            <Grid
              item={true}
              xs={12}
              sm={2}
              md={1}
              style={{ paddingRight: "5px" }}
            >
              <Typography variant="subtitle1">Correct?</Typography>
            </Grid>
            <Grid item={true} xs={12} sm={10} md={11}>
              <Checkbox
                color="primary"
                checked={option.correct}
                onChange={handleAttributeChange("correct")}
                value="true"
                style={{ paddingLeft: "0" }}
              />
            </Grid>

            <Grid item={true} xs={12} sm={3} lg={4}>
              <Typography variant="subtitle1" style={{ paddingRight: "5px" }}>
                Explanation why this option is {!option.correct && "in"}correct
              </Typography>
            </Grid>
            <Grid item={true} xs={12} sm={9} lg={8}>
              <TextField
                variant="outlined"
                fullWidth={true}
                placeholder="feedback message"
                multiline={true}
                value={
                  option.correct
                    ? option.texts[0].successMessage || ""
                    : option.texts[0].failureMessage || ""
                }
                onChange={handleAttributeChange(
                  `${option.correct ? "success" : "failure"}Message`,
                )}
              />
              <Typography variant="body1" style={{ padding: "5px 0" }}>
                The student won't see this before completing the exercise.
              </Typography>
            </Grid>
          </Grid>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          style={{ backgroundColor: "rgb(87, 61, 77)", color: "white" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default connect(null, {
  changeAttr,
  modifyOption,
})(OptionDialogFunc)
