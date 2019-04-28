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
import { connect } from "react-redux"
import { SortableContainer, SortableElement } from "react-sortable-hoc"
import {
  addFinishedOption,
  changeAttr,
  changeOrder,
  modifyOption,
  save,
} from "../store/edit/actions"
import FinishedMultipleChoiceItem from "./FinishedMultipleChoiceItem"
import OptionDialog from "./OptionDialog"
import SortableOptionList from "./SortableOptionList"
import SortableWrapper from "./SortableWrapper"

class MultipleChoiceItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
      existingOptData: null,
      optionsExist: props.items[props.order].options.length > 0,
      existingItemExpanded: false,
    }
  }

  public render() {
    const item = this.props.items[this.props.order]
    if (item.id && !this.state.existingItemExpanded) {
      return (
        <FinishedMultipleChoiceItem
          {...this.props}
          onClickExpand={this.expandExistingItem}
        />
      )
    }

    return (
      <Grid container={true} spacing={16} justify="center" alignItems="center">
        <Grid item={true} xs={12} sm={10} lg={8}>
          <Card>
            <Grid container={true} justify="flex-end" alignItems="center">
              <Grid item={true} xs={12}>
                <CardContent>
                  <Grid
                    container={true}
                    justify="flex-start"
                    alignItems="center"
                    spacing={8}
                  >
                    <Grid item={true} xs={11}>
                      <Typography color="textSecondary" gutterBottom={true}>
                        Type: multiple choice
                      </Typography>
                    </Grid>
                    <Grid item={true} xs={1}>
                      <Reorder
                        fontSize="large"
                        style={{ transform: "scale(3,1.5)" }}
                      />
                    </Grid>

                    <Grid item={true} xs={6} md={4} lg={3}>
                      <TextField
                        multiline={true}
                        fullWidth={true}
                        placeholder={item.id ? this.props.title : "Title"}
                        value={(item.id && item.texts[0].title) || ""}
                        onChange={this.changeEditAttribute("title")}
                        // defaultValue={item.id ? this.props.title : ""}
                        style={{
                          fontWeight: "bold",
                        }}
                      />

                      <Typography style={{ marginTop: "10px" }} variant="body2">
                        Body:
                      </Typography>
                      <TextField
                        rows={2}
                        multiline={true}
                        fullWidth={true}
                        placeholder={item.id ? this.props.body : "Body"}
                        value={item.texts[0].body || ""}
                        onChange={this.changeEditAttribute("body")}
                        // defaultValue={ item.id ? this.props.body : ""}
                      />
                    </Grid>

                    <Grid item={true} xs={6} md={8} lg={9}>
                      {this.state.optionsExist ? (
                        <SortableOptionList
                          onSortEnd={this.onSortEnd}
                          createNewOption={this.createNewOption}
                          items={this.props.items[this.props.order].options}
                          order={this.props.order}
                          modifyExistingOption={this.modifyExistingOption}
                          axis="xy"
                          distance={2}
                        />
                      ) : (
                        <Grid
                          container={true}
                          justify="flex-start"
                          alignItems="center"
                        >
                          <Grid item={true} xs={1}>
                            <IconButton
                              aria-label="Add option"
                              color="primary"
                              disableRipple={true}
                              onClick={this.createNewOption}
                            >
                              <AddCircle
                                fontSize="large"
                                nativeColor="#E5E5E5"
                              />
                            </IconButton>
                          </Grid>

                          <Grid item={true} xs="auto">
                            <Typography color="textSecondary">
                              Your question does not have any options yet. Add
                              an option by clicking the plus button.
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    <OptionDialog
                      onSubmit={
                        this.state.existingOptData
                          ? this.updateOption(this.props.index)
                          : this.handleSubmission(this.props.index)
                      }
                      isOpen={this.state.dialogOpen}
                      onClose={this.handleClose}
                      existingOptData={this.state.existingOptData}
                    />
                  </Grid>
                </CardContent>
              </Grid>

              <Grid item={true} xs="auto" />
              <Grid item={true}>
                <CardActions>
                  <Button
                    style={{
                      backgroundColor: "#00FF19",
                      color: "white",
                      borderRadius: "5px",
                    }}
                    onClick={this.saveItem}
                  >
                    {item.id ? "Save" : "Add"}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#FF1F00",
                      color: "white",
                      borderRadius: "5px",
                    }}
                    onClick={
                      item.id ? this.switchToFinishedView : this.props.onCancel
                    }
                  >
                    Cancel
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    )
  }

  private changeEditAttribute = (attributeName: string) => e => {
    this.props.changeAttr(
      `items[${this.props.order}].texts[0].${attributeName}`,
      e.target.value,
    )
  }

  private saveItem = () => {
    this.setState({
      existingItemExpanded: false,
    })
    this.props.save()
  }

  private expandExistingItem = () => {
    this.setState({
      existingItemExpanded: true,
    })
  }

  private switchToFinishedView = () => {
    this.setState({
      existingItemExpanded: false,
    })
  }

  private modifyExistingOption = (optionId, itemId) => () => {
    const option = this.props.items
      .find(i => i.id === itemId)
      .options.find(o => o.id === optionId)

    this.setState({
      existingOptData: {
        title: option.texts[0].title,
        correct: option.correct,
        successMessage: option.texts[0].successMessage,
        failureMessage: option.texts[0].failureMessage,
        id: optionId,
      },
      dialogOpen: true,
    })
  }

  private onSortEnd = ({ oldIndex, newIndex, collection }) => {
    this.props.changeOrder(collection, oldIndex, newIndex)
  }

  private updateOption = item => optionData => event => {
    this.props.modifyOption(item, optionData)
  }

  private createNewOption = () => {
    this.setState({
      existingOptData: null,
      dialogOpen: true,
    })
  }

  private setOpen = newValue => () => {
    this.setState({
      dialogOpen: newValue,
    })
  }

  private handleClose = () => {
    this.setState({ dialogOpen: false, existingOptData: null })
  }

  private handleSubmission = item => optionData => event => {
    this.handleClose()
    this.props.addFinishedOption(item, optionData)
    this.setState({ optionsExist: true })
  }
}

const mapStateToProps = (state: any) => {
  return {
    items: state.edit.items,
  }
}

export default connect(
  mapStateToProps,
  { addFinishedOption, changeAttr, changeOrder, modifyOption, save },
)(MultipleChoiceItem)
