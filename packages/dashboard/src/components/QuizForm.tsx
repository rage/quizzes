import { Button, Grid, Toolbar, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import {
  addItem,
  addOption,
  changeAttr,
  changeOrder,
  newQuiz,
  save,
  setEdit,
} from "../store/edit/actions"
import { setQuiz } from "../store/filter/actions"
import QuizInfo from "./QuizInfo"
import TabContainer from "./TabContainer"

class QuizForm extends React.Component<any, any> {
  public componentDidMount() {
    if (this.props.quiz) {
      this.props.setEdit(this.props.quiz)
      this.props.setQuiz(this.props.quiz.id)
    } else if (this.props.new) {
      this.props.newQuiz()
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    if (!prevProps.edit.id && this.props.edit.id) {
      this.props.history.push(`/quizzes/${this.props.edit.id}`)
    }
  }

  public render() {
    return (
      <Grid container={true} spacing={16} justify="center">
        <Grid item={true} xs={12} sm={10} lg={8}>
          <QuizInfo quizTexts={this.props.edit.texts[0]} />

          {this.props.edit.course.languages.map(
            (l, i) =>
              this.props.filter.language === l.id && (
                <TabContainer
                  items={this.props.edit.items}
                  peerReviewCollections={this.props.edit.peerReviewCollections}
                  text={this.props.edit.texts.find(
                    text => text.languageId === l.id,
                  )}
                  textIndex={this.props.edit.texts.findIndex(
                    text => text.languageId === l.id,
                  )}
                  handleChange={this.handleChange}
                  key={l.name}
                />
              ),
          )}
          <Toolbar>
            <Typography style={{ flex: 1 }} />
            <Button onClick={this.handleSaving}>save</Button>
          </Toolbar>
        </Grid>
      </Grid>
    )
  }

  private handleSaving = async (event: any) => {
    scrollTo(0, 0)
    // for saving a quiz for the first time, wait before the url is modified in componentDidUpdate
    await this.props.save(event)
  }

  private handleChange = path => event => {
    this.props.changeAttr(
      path,
      path.endsWith("correct") ||
        path.endsWith("default") ||
        path.endsWith("Required")
        ? event.target.checked
        : event.target.value,
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    courses: state.courses,
    edit: state.edit,
    filter: state.filter,
    user: state.user,
  }
}

const mapDispatchToProps = {
  addItem,
  addOption,
  changeAttr,
  changeOrder,
  newQuiz,
  save,
  setEdit,
  setQuiz,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuizForm)
