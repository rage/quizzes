import { Button, Grid, Typography } from "@material-ui/core"
import React from "react"
import { stringContainsLongerWord } from "../../util"
import ShortWrapper from "../ItemTools/ShortWrapper"

class FinishedMultipleChoiceItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]
    return (
      <ShortWrapper toggleExpand={this.props.toggleExpand}>
        <Grid
          container={true}
          spacing={3}
          justify="flex-start"
          alignItems="center"
        >
          <Grid item={true} xs={6} lg={4}>
            <Typography
              variant="h6"
              style={{
                wordBreak: stringContainsLongerWord(item.texts[0].title, 22)
                  ? "break-all"
                  : "normal",
              }}
            >
              {item.texts[0].title}
            </Typography>
            {item.multi && (
              <Typography variant="subtitle1">
                All the correct options must be chosen
              </Typography>
            )}
          </Grid>

          <Grid item={true} xs={6} lg={8}>
            <Grid
              container={true}
              justify="flex-start"
              alignItems="center"
              spacing={3}
            >
              {item.options.map(opt => (
                <Grid
                  item={true}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  key={item.id + opt.order}
                  style={{ textAlign: "center" }}
                >
                  <Button
                    variant="outlined"
                    disabled={true}
                    style={{
                      borderColor: opt.correct ? "green" : "red",
                      textTransform: "none",
                      color: "black",
                      wordBreak: stringContainsLongerWord(
                        opt.texts[0].title,
                        30,
                      )
                        ? "break-all"
                        : "normal",
                    }}
                  >
                    {opt.texts[0].title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </ShortWrapper>
    )
  }
}

export default FinishedMultipleChoiceItem
