import {
  Button,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@material-ui/core"
import Create from "@material-ui/icons/Create"
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
          <Typography variant="title" style={{ textDecoration: "underline" }}>
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
        <Grid item={true} xs={6} style={{ textAlign: "center" }}>
          <Typography variant="title" style={{ textDecoration: "underline" }}>
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
      <Typography variant="title">{title}</Typography>
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
      <Typography variant="body1">{body}</Typography>
    </Grid>
    <Grid xs={4}>
      <Button variant="raised" style={{ color: "gray" }} onClick={onExpand}>
        Edit
        <Create fontSize="small" style={{ marginLeft: ".5em" }} />
      </Button>
    </Grid>
  </Grid>
)

const ExpandedInfo = ({
  filterLanguage,
  courseLanguages,
  quizTexts,
  changeAttribute,
  onExpand,
}) => (
  <Grid container={true} justify="space-between" alignContent="center">
    <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
      <TextField
        placeholder="Title"
        value={(quizTexts && quizTexts.title) || ""}
        onChange={changeAttribute("title")}
      />
    </Grid>
    <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
      <FormControl variant="outlined">
        <InputLabel>Language</InputLabel>
        <Select
          value={filterLanguage}
          // onChange={}
        >
          {courseLanguages.map(languageInfo => {
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
        fullWidth={true}
        variant="outlined"
        value={(quizTexts && quizTexts.body) || ""}
        onChange={changeAttribute("body")}
      />
    </Grid>
    <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
      <TextField
        placeholder="Submit message"
        value={(quizTexts && quizTexts.submitMessage) || ""}
        onChange={changeAttribute("submitMessage")}
      />
    </Grid>
    <Grid item={true} xs={6} sm={4} md={3}>
      <Button variant="outlined" style={{ color: "#79c49b" }}>
        Save
      </Button>
      <Button
        variant="outlined"
        style={{ color: "#d16d68" }}
        onClick={onExpand}
      >
        Cancel
      </Button>
    </Grid>
  </Grid>
)

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
