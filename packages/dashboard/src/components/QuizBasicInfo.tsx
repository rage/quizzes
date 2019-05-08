import {
  Button,
  Collapse,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core"
import ArrowDropUp from "@material-ui/icons/ArrowDropUp"
import Create from "@material-ui/icons/Create"
import MoreVert from "@material-ui/icons/MoreVert"
import React from "react"
import { connect } from "react-redux"
import { changeAttr } from "../store/edit/actions"

class QuizBasicInfo extends React.Component<any, any> {
  public constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
    return (
      <Grid container={true} justify="flex-start" alignItems="center">
        <Grid item={true} xs={3} />
        <Grid item={true} xs={6} style={{ textAlign: "center" }}>
          <Typography variant="h4" style={{ textDecoration: "underline" }}>
            Basic information
          </Typography>
        </Grid>
        <Grid item={true} xs={3} />
        <Grid item={true} xs={12}>
          {this.state.expanded ? (
            <ExpandedInfo
              filterLanguage={this.props.filter.language}
              courseLanguages={this.props.courseLanguages}
              quizTexts={this.props.quizTexts}
              onExpand={this.toggleExpansion}
              changeAttribute={this.changeQuizAttribute}
              setAttribute={this.setQuizAttribute}
            />
          ) : (
            <ShortInfo
              filterLanguage={this.props.filter.language}
              courseLanguages={this.props.courseLanguages}
              title={this.props.quizTexts && this.props.quizTexts.title}
              body={this.props.quizTexts && this.props.quizTexts.body}
              onExpand={this.toggleExpansion}
            />
          )}
        </Grid>
        <Grid item={true} xs={3} />
        <Grid
          item={true}
          xs={6}
          style={{ textAlign: "center", marginTop: "2em" }}
        >
          <Typography variant="h4" style={{ textDecoration: "underline" }}>
            Questions
          </Typography>
        </Grid>
        <Grid item={true} xs={3} />
      </Grid>
    )
  }

  public toggleExpansion = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }

  public changeQuizAttribute = (attributeName: string) => e => {
    this.props.changeAttr(`texts[0].${attributeName}`, e.target.value)
  }

  public setQuizAttribute = (attributeName: string, attributeValue: string) => {
    this.props.changeAttr(`texts[0].${attributeName}`, attributeValue)
  }
}

const ShortInfo = ({
  filterLanguage,
  courseLanguages,
  title,
  body,
  onExpand,
}) => (
  <Grid container={true} justify="space-between">
    <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
      <Typography variant="title" paragraph={true}>{`${title}`}</Typography>
    </Grid>
    <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
      <Select
        value={filterLanguage}
        input={<Input id="language-readonly" name="language" readOnly={true} />}
      >
        {courseLanguages.map(languageInfo => {
          return (
            <MenuItem value={languageInfo.id} key={languageInfo.id}>
              {languageInfo.name}
            </MenuItem>
          )
        })}
      </Select>
    </Grid>
    <Grid xs={12} item={true} style={{ marginBottom: "2em" }}>
      <TogglableQuizInstruction bodyText={body} />
    </Grid>
    <Grid xs={4}>
      <Button variant="raised" style={{ color: "gray" }} onClick={onExpand}>
        Edit
        <Create fontSize="small" style={{ marginLeft: ".5em" }} />
      </Button>
    </Grid>
  </Grid>
)

class ExpandedInfo extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      title: props.quizTexts.title || "",
      body: props.quizTexts.body || "",
      submitMessage: props.quizTexts.submitMessge || "",
    }
  }

  public render() {
    return (
      <Grid container={true} justify="space-between" alignContent="center">
        <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
          <TextField
            placeholder="Title"
            multiline={true}
            rowsMax={10}
            value={this.state.title}
            onChange={this.changeTempAttribute("title")}
          />
        </Grid>
        <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
          <FormControl variant="outlined">
            <InputLabel>Language</InputLabel>
            <Select
              value={this.props.filterLanguage}
              // onChange={}
            >
              {this.props.courseLanguages.map(languageInfo => {
                return (
                  <MenuItem value={languageInfo.id} key={languageInfo.id}>
                    {languageInfo.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
          <TextField
            placeholder="Body"
            multiline={true}
            rows={4}
            rowsMax={15}
            fullWidth={true}
            variant="outlined"
            value={this.state.body}
            onChange={this.changeTempAttribute("body")}
          />
        </Grid>
        <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
          <TextField
            placeholder="Submit message"
            value={this.state.submitMessage}
            onChange={this.changeTempAttribute("submitMessage")}
          />
        </Grid>
        <Grid item={true} xs={6} sm={4} md={3}>
          <Button
            variant="outlined"
            style={{ color: "#79c49b" }}
            onClick={this.saveChanges}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            style={{ color: "#d16d68" }}
            onClick={this.props.onExpand}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    )
  }

  private changeTempAttribute = (attributeName: string) => e => {
    const newState = { ...this.state }
    newState[attributeName] = e.target.value
    this.setState({
      ...newState,
    })
  }

  private saveChanges = () => {
    this.props.setAttribute("title", this.state.title)
    this.props.setAttribute("body", this.state.body)
    this.props.setAttribute("submitMessage", this.state.submitMessage)
    this.props.onExpand()
  }
}

class TogglableQuizInstruction extends React.Component<any, any> {
  public constructor({ props }) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
    if (!this.props.bodyText) {
      return <div />
    }
    let content = this.props.bodyText

    if (this.state.expanded) {
      return (
        <Paper style={{ padding: "2em 1em 2em 1em" }}>
          <Grid container={true} justify="center">
            <Grid item={true} xs={12}>
              <Typography
                variant="body1"
                paragraph={true}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {content}
              </Typography>
            </Grid>
            <Grid item={true} xs={6} sm={4} md={2}>
              <IconButton onClick={this.toggleExpansion}>
                <ArrowDropUp fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      )
    }

    const lines: string[] = this.props.bodyText.split("\n")
    if (lines.length > 16) {
      content = lines.splice(0, 15).join("\n")
    }

    return (
      <Paper style={{ padding: "2em 1em 2em 1em" }}>
        <Grid container={true} justify="center">
          <Grid item={true} xs={12}>
            <Typography
              variant="body1"
              paragraph={true}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {content}
            </Typography>
          </Grid>
          {lines.length > 16 && (
            <Grid item={true} xs={6} sm={4} md={2}>
              <IconButton onClick={this.toggleExpansion}>
                <MoreVert fontSize="large" />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
    )
  }

  private toggleExpansion = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }
}

const mapStateToProps = (state: any) => {
  return {
    filter: state.filter,
    courseLanguages: state.edit.course.languages,
    quizTexts: state.edit.texts[0],
  }
}

export default connect(
  mapStateToProps,
  { changeAttr },
)(QuizBasicInfo)
