import { Card, CardContent, Grid, TextField } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { changeAttr, save } from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"

class ExpandedCheckbox extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const item = this.props.items[this.props.order]
    const initData = {
      title: item.texts[0].title,
      optionTitle: item.options[0].texts[0].title,
      optionBody: item.options[0].texts[0].body,
    }
    this.state = {
      tempItemData: initData,
      titleHasBeenModified: item.id ? true : false,
      optionTitleHasBeenModified: item.id ? true : false,
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

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        fullWidth={true}
                        multiline={true}
                        label="Option title"
                        value={
                          (this.state.optionTitleHasBeenModified &&
                            this.state.tempItemData.optionTitle) ||
                          ""
                        }
                        onChange={this.changeTempAttribute("optionTitle")}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />

                    <Grid item={true} xs={10} md={8} lg={6}>
                      <TextField
                        fullWidth={true}
                        multiline={true}
                        label="Option body"
                        value={this.state.tempItemData.optionBody || ""}
                        onChange={this.changeTempAttribute("optionBody")}
                      />
                    </Grid>
                    <Grid item={true} xs="auto" />
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
    if (attributeName === "optionTitle") {
      this.setState({
        optionTitleHasBeenModified: true,
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
      `items[${this.props.order}].options[0].texts[0].title`,
      this.state.tempItemData.optionTitle,
    )

    this.props.changeAttr(
      `items[${this.props.order}].options[0].texts[0].body`,
      this.state.tempItemData.optionBody,
    )

    this.props.save()
  }
}

export default connect(
  null,
  { changeAttr, save },
)(ExpandedCheckbox)
