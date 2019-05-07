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

class ExpandedEssay extends React.Component<any, any> {
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

                    <Grid item={true} xs={12}>
                      <TextField
                        variant="outlined"
                        multiline={true}
                        rows={3}
                        fullWidth={true}
                        label="Body"
                        value={item.texts[0].body || ""}
                        onChange={this.changeEditAttribute("body")}
                      />
                    </Grid>

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <FormControlLabel
                        aria-label="Minimum number of words"
                        name="min-words"
                        label="Min words:"
                        labelPlacement="start"
                        control={
                          <TextField
                            style={{
                              maxWidth: "5em",
                              padding: "0px",
                              marginLeft: ".5em",
                            }}
                            type="number"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ min: 1 }}
                            value={item.minWords || ""}
                            onChange={this.changeEditAttribute("minWords")}
                          />
                        }
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <FormControlLabel
                        aria-label="Maximum number of words"
                        name="max-words"
                        label="Max words:"
                        labelPlacement="start"
                        control={
                          <TextField
                            style={{
                              maxWidth: "5em",
                              marginLeft: ".5em",
                            }}
                            type="number"
                            variant="outlined"
                            margin="dense"
                            value={item.maxWords || ""}
                            onChange={this.changeEditAttribute("maxWords")}
                          />
                        }
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />
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
    if (attributeName === "minWords" || attributeName === "maxWords") {
      this.props.changeAttr(
        `items[${this.props.order}].${attributeName}`,
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
)(ExpandedEssay)
