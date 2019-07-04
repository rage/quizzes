import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import {
  addFinishedOption,
  changeAttr,
  changeOrder,
  modifyOption,
  save,
} from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"

class ExpandedScaleItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const item = this.props.items[this.props.order]
    const initialItemData = {
      title: item.texts[0].title,
      body: item.texts[0].body,
      minValue: item.minValue || 1,
      maxValue: item.maxValue || 7,
      minLabel: item.texts[0].minLabel,
      maxLabel: item.texts[0].maxLabel,
    }
    this.state = {
      tempItemData: initialItemData,
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
                        onChange={this.changeEditAttribute("title")}
                        style={{
                          fontWeight: "bold",
                          margin: "2em 0em 2em 0em",
                        }}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        multiline={true}
                        fullWidth={true}
                        label="Body"
                        value={this.state.tempItemData.body || ""}
                        onChange={this.changeEditAttribute("body")}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <Grid item={true} xs={11} md={11} lg={8}>
                      <Grid
                        container={true}
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Grid item={true} xs="auto">
                          <FormControlLabel
                            aria-label="Minimum option for scale"
                            name="min-alternative"
                            label="Min value"
                            labelPlacement="start"
                            control={
                              <TextField
                                style={{
                                  maxWidth: "5em",
                                  padding: "0px",
                                  marginLeft: ".5em",
                                }}
                                required={true}
                                type="number"
                                variant="outlined"
                                margin="dense"
                                value={this.state.tempItemData.minValue}
                                inputProps={{ min: 2 }}
                                onChange={this.changeEditAttribute("minValue")}
                              />
                            }
                          />
                          <Typography
                            style={{
                              display: "inline",
                              marginLeft: "1.5em",
                              fontWeight: "bold",
                            }}
                          >
                            *
                          </Typography>
                        </Grid>

                        <Grid item={true} xs="auto">
                          <FormControlLabel
                            aria-label="Maximum option for scale"
                            name="max-alternative"
                            label="Max value"
                            labelPlacement="start"
                            control={
                              <TextField
                                style={{
                                  maxWidth: "5em",
                                  marginLeft: ".5em",
                                }}
                                required={true}
                                type="number"
                                variant="outlined"
                                margin="dense"
                                value={this.state.tempItemData.maxValue}
                                inputProps={{ min: 2 }}
                                onChange={this.changeEditAttribute("maxValue")}
                              />
                            }
                          />
                          <Typography
                            style={{
                              display: "inline",
                              marginLeft: "1.5em",
                              fontWeight: "bold",
                            }}
                          >
                            *
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        fullWidth={true}
                        label="Min label"
                        value={this.state.tempItemData.minLabel || ""}
                        onChange={this.changeEditAttribute("minLabel")}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        fullWidth={true}
                        label="Max label"
                        value={this.state.tempItemData.maxLabel || ""}
                        onChange={this.changeEditAttribute("maxLabel")}
                      />
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
      </Grid>
    )
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
    this.props.changeAttr(
      `items[${this.props.order}].minValue`,
      this.state.tempItemData.minValue,
    )
    this.props.changeAttr(
      `items[${this.props.order}].maxValue`,
      this.state.tempItemData.maxValue,
    )
    this.props.changeAttr(
      `items[${this.props.order}].texts[0].minLabel`,
      this.state.tempItemData.minLabel,
    )
    this.props.changeAttr(
      `items[${this.props.order}].texts[0].maxLabel`,
      this.state.tempItemData.maxLabel,
    )

    this.props.save()
  }
}

export default connect(
  null,
  { addFinishedOption, changeAttr, changeOrder, modifyOption, save },
)(ExpandedScaleItem)
