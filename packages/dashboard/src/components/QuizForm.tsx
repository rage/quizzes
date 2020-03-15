import { Button, Grid, Toolbar, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { Link, Prompt } from "react-router-dom"
import { ICourse, IQuiz } from "../interfaces"

import {
  addItem,
  addOption,
  changeAttr,
  changeOrder,
  newQuiz,
  save,
  setEdit,
} from "../store/edit/actions"
import { IEditState } from "../store/edit/reducer"
import { setQuiz } from "../store/filter/actions"
import { IFilterState } from "../store/filter/reducer"
import { IUserState } from "../store/user/reducer"
import QuizInfo from "./QuizInfo"
import TabContainer from "./TabContainer"
import { quizContentsDiffer } from "./tools"

interface IQuizFormProps {
  courses: ICourse[]
  courseInfos: any[]
  edit: IEditState
  filter: IFilterState
  user: IUserState
  quiz?: IQuiz
  new: boolean
  history: any
  addItem: any
  addOption: any
  changeAttr: any
  changeOrder: any
  newQuiz: any
  save: any
  setEdit: (quiz: IQuiz) => any
  setQuiz: (quizId?: string, alsoSetCourse?: boolean) => any
}

class QuizForm extends React.Component<IQuizFormProps, any> {
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
          {this.props.edit.id && (
            <Link
              to={`/quizzes/${this.props.edit.id}/answers`}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: "rgb(16, 126, 171)",
                  color: "white",
                  borderRadius: "0px",
                }}
              >
                View the answers
              </Button>
            </Link>
          )}
          <QuizInfo quizTexts={this.props.edit.texts[0]} />

          <Prompt message={this.checker} />

          {this.props.edit.course.languages.map(
            (l, i) =>
              this.props.filter.language === l.id && (
                <TabContainer
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
            <Button
              variant="outlined"
              style={{ backgroundColor: "rgb(15, 125, 0)", color: "white" }}
              onClick={this.handleSaving}
            >
              save
            </Button>
          </Toolbar>
        </Grid>
      </Grid>
    )
  }

  private handleSaving = async (event: any) => {
    scrollTo(0, 0)
    // for saving a quiz for the first time, wait before the url is modified in componentDidUpdate
    // await
    this.props.save()
  }

  private checker = location => {
    if (location.pathname !== this.props.history.location.pathname) {
      if (this.props.new && location.pathname.includes("/quizzes/")) {
        return true
      }

      if (this.shouldPromptUser()) {
        return "There are unsaved changes on the page. Are you sure you want to exit?"
      }
    }
  }

  private shouldPromptUser = () => {
    const savedQuizInfo = this.props.courseInfos
      .find(ci => ci.courseId === this.props.filter.course)
      .quizzes.find(q => q.id === this.props.filter.quiz)

    const editInfo = this.props.edit

    const unsaved = quizContentsDiffer(editInfo as IQuiz, savedQuizInfo)
    return unsaved
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
    courseInfos: state.quizzes.courseInfos,
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

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)
