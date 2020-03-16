import {
  Card,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import React from "react"
import { connect } from "react-redux"
import {
  addOption,
  changeAttr,
  modifyOptionOrder,
  removeOption,
  updateMultipleOptions,
} from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"
import SortableCheckboxList from "./SortableCheckboxList"

class ExpandedResearchAgreement extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const item = props.items[props.order]

    const initOptionData = item.options.map(option => ({
      title: option.texts[0].title,
      body: option.texts[0].body,
      titleHasBeenModified: item.id ? true : false,
      order: option.order,
      id: option.id,
      correct: true,
    }))

    const initData = {
      options: initOptionData,
    }
    this.state = {
      tempItemData: initData,
      titleHasBeenModified: item.id ? true : false,
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

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        fullWidth={true}
                        multiline={true}
                        required={true}
                        label="Title"
                        value={item.texts[0].title || ""}
                        onChange={this.changeTempAttribute("title")}
                        style={{
                          fontWeight: "bold",
                          margin: "2em 0em 2em 0em",
                        }}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <SortableCheckboxList
                      options={item.options}
                      onRemove={this.removeOption}
                      changeTempOptionAttribute={this.changeTempOptionAttribute}
                      itemOrder={item.order}
                      onSortEnd={this.onSortEnd}
                      axis="y"
                      distance={2}
                    />

                    <Grid item={true} xs="auto">
                      <IconButton
                        aria-label="Add option"
                        color="primary"
                        disableRipple={true}
                        onClick={this.addOption}
                      >
                        <AddCircle fontSize="large" nativeColor="#E5E5E5" />
                      </IconButton>
                    </Grid>
                    <Grid item={true} xs="auto">
                      <Typography>Add new checkbox</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>

              <BottomActionsExpItem
                itemHasBeenSaved={item.id ? true : false}
                handleExpand={this.props.toggleExpand}
                handleCancel={this.props.onCancel}
                index={this.props.order}
              />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    )
  }

  private onSortEnd = ({ oldIndex, newIndex, collection }) => {
    this.props.modifyOptionOrder(
      this.props.items[this.props.order],
      oldIndex,
      newIndex,
    )
  }

  private addOption = () => {
    this.props.addOption(this.props.order)
  }

  private removeOption = (order: number) => e => {
    const item = this.props.items[this.props.order]
    const optionToBeRemoved = item.options.find(opt => opt.order === order)
    if (item.options.length <= 1 || !optionToBeRemoved) {
      return
    }
    this.props.removeOption(optionToBeRemoved)
  }

  private changeTempOptionAttribute = (
    order: number,
    attributeName: string,
  ) => e => {
    const value = e.target.value

    /*
    const item = this.props.items[this.props.order]
    const newOption = {...item.options.find(opt => opt.order === order)}
    newOption.texts[0][attributeName] = value
    const newOptions = item.options.map(opt => opt.order !== order ? opt : newOption)
    */

    this.props.changeAttr(
      `items[${this.props.order}].options[${order}].texts[0].${attributeName}`,
      value,
    )
  }

  private changeTempAttribute = (attributeName: string) => e => {
    const value = e.target.value
    if (attributeName === "title") {
      this.props.changeAttr(`items[${this.props.order}].texts[0].title`, value)
    }
  }
}

export default connect(null, {
  addOption,
  changeAttr,
  removeOption,
  modifyOptionOrder,
  updateMultipleOptions,
})(ExpandedResearchAgreement)
