import {
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import React from "react"
import { connect } from "react-redux"
import {
  addFinishedOption,
  changeAttr,
  changeOrder,
  modifyOption,
  save,
  updateMultipleOptions,
} from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"
import OptionDialog from "../OptionDialog"
import SortableOptionList from "./SortableOptionList"

class MultipleChoiceItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const item = this.props.items[this.props.order]

    const initOptionsData = item.options.map(option => ({
      title: option.texts[0].title,
      body: option.texts[0].body,
      order: option.order,
      id: option.id,
      quizItemId: item.id,
      successMessage: option.texts[0].successMessage,
      failureMessage: option.texts[0].failureMessage,
      correct: option.correct,
    }))

    const initItemData = {
      title: item.texts[0].title,
      body: item.texts[0].body,
      options: initOptionsData,
    }
    this.state = {
      dialogOpen: false,
      existingOptData: null,
      tempItemData: initItemData,
      optionsExist: props.items[props.order].options.length > 0,
      titleHasBeenModified: this.props.items[this.props.order].id
        ? true
        : false,
    }
  }

  public render() {
    const item = this.props.items[this.props.order]
    return (
      <Grid container={true} spacing={16} justify="center" alignItems="center">
        <Grid item={true} xs={12}>
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
                    <ExpandedTopInformation type={this.props.type} />

                    <Grid item={true} xs={6} md={4} lg={3}>
                      <TextField
                        multiline={true}
                        fullWidth={true}
                        placeholder="Title"
                        value={
                          (this.state.titleHasBeenModified &&
                            this.state.tempItemData.title) ||
                          ""
                        }
                        onChange={this.changeEditAttribute("title")}
                        style={{
                          fontWeight: "bold",
                          margin: "2em 0em 2em 0em",
                        }}
                      />

                      <TextField
                        multiline={true}
                        fullWidth={true}
                        placeholder="Body"
                        value={this.state.tempItemData.body || ""}
                        onChange={this.changeEditAttribute("body")}
                      />
                    </Grid>

                    <Grid item={true} xs={6} md={8} lg={9}>
                      {this.state.optionsExist ? (
                        <SortableOptionList
                          onSortEnd={this.onSortEnd}
                          createNewOption={this.createNewOption}
                          options={this.state.tempItemData.options}
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
                  </Grid>
                </CardContent>
              </Grid>

              <Grid item={true} xs="auto" />
              <BottomActionsExpItem
                onSave={this.saveItem}
                itemHasBeenSaved={item.id ? true : false}
                handleExpand={this.props.toggleExpand}
                handleCancel={this.props.onCancel}
                index={this.props.order}
              />
            </Grid>
          </Card>
        </Grid>

        <OptionDialog
          onSubmit={
            this.state.existingOptData
              ? this.updateOption(this.props.index)
              : this.handleSubmission(item.id)
          }
          isOpen={this.state.dialogOpen}
          onClose={this.handleClose}
          existingOptData={this.state.existingOptData}
          changeOptionAttribute={this.changeTempOptionAttribute}
        />
      </Grid>
    )
  }

  private changeTempOptionAttribute = (
    order: number,
    attributeName: string,
  ) => e => {
    const copyTempItemData = { ...this.state.tempItemData }
    const newOptionData = copyTempItemData.options
    newOptionData[order][attributeName] = e.target.value
    if (attributeName === "title") {
      newOptionData[order].titleHasBeenModified = true
    }

    this.setState({
      tempItemData: { ...this.state.tempItemData, options: newOptionData },
    })
  }

  private changeEditAttribute = (attributeName: string) => e => {
    if (attributeName === "title") {
      this.setState({
        titleHasBeenModified: true,
      })
    }
    const newData = { ...this.state.tempItemData }
    newData[attributeName] = e.target.value
    this.setState({ tempItemData: newData })
  }

  private saveItem = e => {
    this.props.toggleExpand(e)

    this.props.changeAttr(
      `items[${this.props.order}].texts[0].title`,
      this.state.tempItemData.title,
    )
    this.props.changeAttr(
      `items[${this.props.order}].texts[0].body`,
      this.state.tempItemData.body,
    )

    this.props.updateMultipleOptions(
      this.props.order,
      this.state.tempItemData.options,
    )

    this.props.save()
  }

  private modifyExistingOption = (optionOrder: number) => () => {
    const option = this.state.tempItemData.options.find(
      opt => opt.order === optionOrder,
    )

    const newData = {
      title: option.title,
      correct: option.correct,
      successMessage: option.successMessage,
      failureMessage: option.failureMessage,
      order: option.order,
    }

    this.setState({
      existingOptData: newData,
      dialogOpen: true,
    })
  }

  private onSortEnd = ({ oldIndex, newIndex, collection }) => {
    const newOptions = { ...this.state.tempItemData }.options
    newOptions[oldIndex].order = newIndex
    newOptions[newIndex].order = oldIndex

    const temp = newOptions[oldIndex]
    newOptions[oldIndex] = newOptions[newIndex]
    newOptions[newIndex] = temp

    this.setState({
      tempItemData: {
        ...this.state.tempItemData,
        options: newOptions,
      },
    })
  }

  private updateOption = item => optionData => event => {
    const newOptions = { ...this.state.tempItemData }.options.map(opt => {
      if (opt.order !== optionData.order) {
        return opt
      }
      return {
        ...opt,
        title: optionData.title,
        body: optionData.body,
        failureMessage: optionData.failureMessage,
        successMessage: optionData.successMessage,
        correct: optionData.correct,
      }
    })

    this.setState({
      tempItemData: {
        ...this.state.tempItemData,
        options: newOptions,
      },
    })
  }

  private createNewOption = () => {
    this.setState({
      existingOptData: null,
      dialogOpen: true,
    })
  }

  private handleClose = () => {
    this.setState({ dialogOpen: false, existingOptData: null })
  }

  private handleSubmission = (itemId: string) => optionData => event => {
    this.handleClose()

    const newOption = {
      title: optionData.title,
      body: optionData.body,
      successMessage: optionData.successMessage,
      failureMessage: optionData.failureMessage,
      correct: optionData.correct,
      order: this.state.tempItemData.options.length,
      quizItemId: itemId,
    }

    const newOptions = this.state.tempItemData.options.concat(newOption)

    this.setState({
      optionsExist: true,
      tempItemData: {
        ...this.state.tempItemData,
        options: newOptions,
      },
    })
  }
}

export default connect(
  null,
  {
    addFinishedOption,
    changeAttr,
    changeOrder,
    modifyOption,
    save,
    updateMultipleOptions,
  },
)(MultipleChoiceItem)
