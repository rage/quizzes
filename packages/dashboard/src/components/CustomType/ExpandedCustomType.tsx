import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { changeAttr, save } from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"

class ExpandedCustomType extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const item = this.props.items[this.props.order]
    const initData = {
      title: item.texts[0].title,
      body: item.texts[0].body,
    }
    this.state = {
      tempItemData: initData,
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
                        value={this.state.tempItemData.body || ""}
                        onChange={this.changeTempAttribute("body")}
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
    this.props.changeAttr(
      `items[${this.props.order}].texts[0].body`,
      this.state.tempItemData.body,
    )

    this.props.save()
  }
}

export default connect(null, { changeAttr, save })(ExpandedCustomType)
