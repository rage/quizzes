import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import Reorder from "@material-ui/icons/Reorder"
import React from "react"
import { connect } from "react-redux"
import {
  addFinishedOption,
  changeAttr,
  changeOrder,
  modifyOption,
  save,
} from "../../store/edit/actions"
import DragHandleWrapper from "../DragHandleWrapper"
import OptionDialog from "../OptionDialog"

class ExpandedScaleItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      titleHasBeenModified: this.props.items[this.props.order].id
        ? true
        : false,
    }
  }

  public render() {
    const item = this.props.items[this.props.order]
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
                    <TopInformation type={this.props.type} />

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        fullWidth={true}
                        multiline={true}
                        required={true}
                        label="Title"
                        value={
                          (this.state.titleHasBeenModified &&
                            item.texts[0].title) ||
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
                        value={item.texts[0].body || ""}
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
                                defaultValue={1}
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
                                defaultValue={7}
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
                        value={item.texts[0].successMessage || ""}
                        onChange={this.changeEditAttribute("successMessage")}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        fullWidth={true}
                        label="Max label"
                        value={item.texts[0].failureMessage || ""}
                        onChange={this.changeEditAttribute("failureMessage")}
                      />
                    </Grid>
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
                      item.id ? this.props.toggleExpand : this.props.onCancel
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
    if (attributeName === "title") {
      this.setState({
        titleHasBeenModified: true,
      })
    }
    if (attributeName === "minValue" || attributeName === "maxValue") {
      this.props.changeAttr(
        `items[${this.props.order}].${
          attributeName === "minValue" ? "minWords" : "maxWords"
        }`,
        e.target.value,
      )
    } else {
      this.props.changeAttr(
        `items[${this.props.order}].texts[0].${attributeName}`,
        e.target.value,
      )
    }
  }

  private saveItem = e => {
    this.props.toggleExpand(e)
    this.props.save()
  }

  private handleClose = () => {
    this.setState({ dialogOpen: false, existingOptData: null })
  }

  private handleSubmission = (item: string) => optionData => event => {
    this.handleClose()
    this.props.addFinishedOption(item, optionData)
    this.setState({ optionsExist: true })
  }
}

const TopInformation = ({ type }) => (
  <React.Fragment>
    <Grid item={true} xs={11}>
      <Typography color="textSecondary" gutterBottom={true}>
        Type: {type.charAt(0).toUpperCase() + type.substring(1, type.length)}
      </Typography>
    </Grid>

    <Grid item={true} xs={1}>
      <DragHandleWrapper>
        <Reorder
          fontSize="large"
          style={{
            transform: "scale(3,1.5)",
            cursor: "pointer",
          }}
        />
      </DragHandleWrapper>
    </Grid>
  </React.Fragment>
)

export default connect(
  null,
  { addFinishedOption, changeAttr, changeOrder, modifyOption, save },
)(ExpandedScaleItem)
