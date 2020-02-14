import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { changeAttr } from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"

class ExpandedEssay extends React.Component<any, any> {
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

                    <Grid item={true} xs={12}>
                      <TextField
                        variant="outlined"
                        multiline={true}
                        rows={3}
                        fullWidth={true}
                        label="Body"
                        value={item.texts[0].body || ""}
                        onChange={this.changeTempAttribute("body")}
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
                            inputProps={{ min: 0 }}
                            value={item.minWords || ""}
                            onChange={this.changeTempAttribute("minWords")}
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
                            inputProps={{ min: 0 }}
                            value={item.maxWords || ""}
                            onChange={this.changeTempAttribute("maxWords")}
                          />
                        }
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />
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
      </Grid>
    )
  }

  private changeTempAttribute = (attributeName: string) => e => {
    let value = e.target.value

    if (attributeName === "title" || attributeName === "body") {
      this.props.changeAttr(
        `items[${this.props.order}].texts[0].${attributeName}`,
        value,
      )
    } else {
      // no string stored in min/maxWords
      if (value === "") {
        value = null
      }
      this.props.changeAttr(
        `items[${this.props.order}].${attributeName}`,
        Number(value),
      )
    }
  }
}

export default connect(
  null,
  { changeAttr },
)(ExpandedEssay)
