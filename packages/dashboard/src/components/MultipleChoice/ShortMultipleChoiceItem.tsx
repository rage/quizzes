import { Button, Grid, Typography } from "@material-ui/core"
import React from "react"
import { stringContainsLongerWord } from "../../../../common/src/util/index"
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
          spacing={16}
          justify="flex-start"
          alignItems="center"
        >
          <Grid item={true} xs={6} lg={4}>
            <Typography
              variant="title"
              style={{
                wordBreak: stringContainsLongerWord(item.texts[0].title, 22)
                  ? "break-all"
                  : "normal",
              }}
            >
              {item.texts[0].title}
            </Typography>
          </Grid>

          <Grid item={true} xs={6} lg={8}>
            <Grid
              container={true}
              justify="flex-start"
              alignItems="center"
              spacing={16}
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
        {item.multi && (
          <Typography variant="subtitle1">
            Answerers can choose multiple options
          </Typography>
        )}
      </ShortWrapper>
    )
  }
}

export default FinishedMultipleChoiceItem
