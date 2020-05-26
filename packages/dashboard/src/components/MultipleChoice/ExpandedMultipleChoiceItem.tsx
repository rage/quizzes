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
import { IQuizItem, QuizItemType } from "../../interfaces"
import {
  addFinishedOption,
  addOption,
  changeAttr,
  changeOrder,
  modifyOption,
  modifyOptionOrder,
  save,
  updateMultipleOptions,
} from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"
import OptionDialog from "../OptionDialog"
import MultiToggle from "./MultiToggle"
import SharedFeedbackCustomiser from "./SharedFeedbackCustomiser"
import SortableOptionList from "./SortableOptionList"

interface IExpandedMultipleChoiceItemProps {
  addOption: any
  items: IQuizItem[]
  order: number
  type: QuizItemType
  index: number
  save: any
  toggleExpand: any
  onCancel: any
  changeAttr: any
  updateMultipleOptions: any
  modifyOptionOrder: any
}

interface IMultipleChoiceItemState {
  dialogOpen: boolean
  openIdx: number
}

export interface IOptionData {
  title: string
  body: string
  order: number
  id?: string
  quizItemId: string
  successMessage: string
  failureMessage: string
  correct: boolean
  titleHasBeenModified?: boolean
}

class MultipleChoiceItem extends React.Component<
  IExpandedMultipleChoiceItemProps,
  IMultipleChoiceItemState
> {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
      openIdx: 0,
    }
  }

  public render() {
    const item = this.props.items[this.props.order]
    return (
      <Grid container={true} spacing={3} justify="center" alignItems="center">
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
                        value={item.texts[0].title || ""}
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
                        value={item.texts[0].body || ""}
                        onChange={this.changeEditAttribute("body")}
                      />
                    </Grid>

                    <Grid item={true} xs={6} md={8} lg={9}>
                      {item.options.length > 0 ? (
                        <SortableOptionList
                          onSortEnd={this.onSortEnd}
                          createNewOption={this.createNewOption}
                          options={item.options}
                          order={this.props.order}
                          axis="xy"
                          distance={2}
                          openOptionDialog={this.openOptionForModification}
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
                                component="svg"
                                fontSize="large"
                                htmlColor="#E5E5E5"
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
                    <Grid item={true} xs={12}>
                      <SharedFeedbackCustomiser
                        sharedMessageIsUsed={
                          item.usesSharedOptionFeedbackMessage
                        }
                        sharedFeedbackMessage={
                          item.texts[0].sharedOptionFeedbackMessage
                        }
                        handleToggleChange={this.changeEditAttribute(
                          "usesSharedOptionFeedbackMessage",
                        )}
                        handleMessageChange={this.changeEditAttribute(
                          "sharedOptionFeedbackMessage",
                        )}
                      />
                    </Grid>

                    <Grid item={true} xs={12}>
                      <MultiToggle
                        multi={item.multi}
                        toggleMulti={this.changeEditAttribute("multi")}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>

              <Grid item={true} xs="auto" />
              <BottomActionsExpItem
                itemHasBeenSaved={item.id ? true : false}
                handleExpand={this.props.toggleExpand}
                handleCancel={this.props.onCancel}
                index={this.props.order}
              />
            </Grid>
          </Card>
        </Grid>

        <OptionDialog
          optionIdx={this.state.openIdx}
          isOpen={this.state.dialogOpen}
          onClose={this.handleClose}
          item={item}
        />
      </Grid>
    )
  }

  private changeEditAttribute = (attributeName: string) => e => {
    const value = e.target.value
    const itemsString = `items[${this.props.order}]`

    switch (attributeName) {
      case "title":
      case "body":
      case "sharedOptionFeedbackMessage":
        this.props.changeAttr(`${itemsString}.texts[0].${attributeName}`, value)
        break
      case "multi":
      case "usesSharedOptionFeedbackMessage":
        this.props.changeAttr(
          `${itemsString}.${attributeName}`,
          !this.props.items[this.props.order][attributeName],
        )
        break
      default:
    }
  }

  private modifyOption = (optionOrder: number) => () => {
    const option = this.props.items[this.props.index].options.find(
      opt => opt.order === optionOrder,
    )

    if (!option) {
      return
    }
    this.setState({
      dialogOpen: true,
    })
  }

  private onSortEnd = ({ oldIndex, newIndex, collection }) => {
    this.props.modifyOptionOrder(
      this.props.items[this.props.order],
      oldIndex,
      newIndex,
    )
  }

  private openOptionForModification = optionIdx => () => {
    this.setState({
      dialogOpen: true,
      openIdx: optionIdx,
    })
  }

  private createNewOption = () => {
    const newIdx = this.props.items[this.props.index].options.length
    this.props.addOption(this.props.index)

    this.setState({
      dialogOpen: true,
      openIdx: newIdx,
    })
  }

  private handleClose = () => {
    this.setState({ dialogOpen: false })
  }
}

export default connect(null, {
  addFinishedOption,
  addOption,
  changeAttr,
  changeOrder,
  modifyOption,
  modifyOptionOrder,
  save,
  updateMultipleOptions,
})(MultipleChoiceItem)
