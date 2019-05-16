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
import Clear from "@material-ui/icons/Clear"
import React from "react"
import { connect } from "react-redux"
import { addOption, changeAttr, save } from "../../store/edit/actions"
import CheckboxDialog from "../ItemTools/CheckboxDialog"
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
    }))

    const initData = {
      title: item.texts[0].title,
      options: initOptionData,
    }
    this.state = {
      tempItemData: initData,
      titleHasBeenModified: item.id ? true : false,
    }
  }

  public render() {
    const item = this.props.items[this.props.order]
    console.log("Info of item:", item)
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
                        value={
                          (this.state.titleHasBeenModified &&
                            this.state.tempItemData.title) ||
                          ""
                        }
                        onChange={this.changeTempAttribute("title")}
                        style={{
                          fontWeight: "bold",
                          margin: "2em 0em 2em 0em",
                        }}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <SortableCheckboxList
                      options={this.state.tempItemData.options}
                      onRemove={this.removeOption}
                      changeTempOptionAttribute={this.changeTempOptionAttribute}
                      itemOrder={item.order}
                      onSortEnd={this.onSortEnd}
                      axis="y"
                      distance={2}
                    />

                    {/*
                      this.state.tempItemData.options.map(optionData => {
                        return (
                        <Grid item={true} xs={12} key={optionData.order} style={{marginBottom: "2em"}}>
                        <Grid container={true} justify="flex-start" alignItems="center">
                        <Grid item={true} xs={2} md={1}>
                          <Checkbox disabled={true} color="primary"/>
                        </Grid>
                        <Grid item={true} xs="auto">
                        <TextField
                            fullWidth={true}
                            multiline={true}
                            label="Option title"
                            value={
                              (optionData.titleHasBeenModified &&
                                optionData.title) ||
                              ""
                            }
                            onChange={this.changeTempOptionAttribute(optionData.order, "title")}
                          />

                          <TextField
                            fullWidth={true}
                            multiline={true}
                            label="Option body"
                            value={optionData.body || ""}
                            onChange={this.changeTempOptionAttribute(optionData.order, "body")}
                          />
                        </Grid>

                        { 
                          this.state.tempItemData.options.length > 1 &&
                          (<Grid item={true} xs={2} md={1}>
                            <IconButton
                              onClick={this.removeOption(optionData.order)}
                            >
                              <Clear fontSize="large" />
                            </IconButton>
                        </Grid>)
                        }


                        </Grid>
                        </Grid>
                        )
                      })
                      */}

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
                onSave={this.saveItem}
                itemHasBeenSaved={item.id ? true : false}
                handleExpand={this.props.toggleExpand}
                handleCancel={this.props.onCancel}
                index={this.props.order}
              />
            </Grid>
          </Card>
        </Grid>

        {/*
          <CheckboxDialog
          onSubmit={
              this.updateOption(this.props.index)
          }
          isOpen={this.state.dialogOpen}
          onClose={this.handleClose}
          existingOptData={this.state.tempItemData.options}
        />
*/}
      </Grid>
    )
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

  private addOption = () => {
    const oldOptions = this.state.tempItemData.options

    this.setState({
      tempItemData: {
        ...this.state.tempItemData,
        options: oldOptions.concat({
          title: "",
          body: "",
          order: oldOptions.length,
          titleHasBeenModified: false,
        }),
      },
    })
  }

  private removeOption = (order: number) => e => {
    console.log("Began removing! The given order: ", order)
    console.log("The state of the options: ", this.state.tempItemData)
    if (this.state.tempItemData.options.length <= 1) {
      return
    }

    this.setState({
      tempItemData: {
        ...this.state.tempItemData,
        options: this.state.tempItemData.options.filter(
          opt => opt.order !== order,
        ),
      },
    })
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
      tempItemData: { ...copyTempItemData, options: newOptionData },
    })
  }

  private changeTempAttribute = (attributeName: string) => e => {
    if (attributeName === "title") {
      this.setState({
        titleHasBeenModified: true,
      })
    }

    const newData = { ...this.state.tempItemData }
    newData[attributeName] = e.target.value

    this.setState({
      tempItemData: newData,
    })
  }

  private saveItem = e => {
    this.props.toggleExpand(e)
    this.props.changeAttr(
      `items[${this.props.order}].texts[0].title`,
      this.state.tempItemData.title,
    )

    this.state.tempItemData.options.forEach(optData => {
      // order could change before saving??
      // not yet but soon
      this.props.changeAttr(
        `items[${this.props.order}].options[${optData.order}].texts[0].title`,
        optData.title,
      )

      this.props.changeAttr(
        `items[${this.props.order}].options[${optData.order}].texts[0].body`,
        optData.body,
      )
    })

    this.props.save()
  }
}

export default connect(
  null,
  { addOption, changeAttr, save },
)(ExpandedResearchAgreement)
