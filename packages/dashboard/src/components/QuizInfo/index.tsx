import { Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { ICourse, ILanguage, IQuiz, IQuizText } from "../../interfaces"
import { changeAttr } from "../../store/edit/actions"
import ExpandedQuizInfo from "./ExpandedQuizInfo"
import ShortQuizInfo from "./ShortQuizInfo"

interface IQuizInfoPropsFromState {
  filter: any
  courseLanguages: ILanguage[]
  part: number
  section: number
  includesEssay: boolean
  courses: ICourse[]
  currentCourseId: string
  quizHasBeenSaved: boolean
  edit: IQuiz
}

interface IQuizInfoProps extends IQuizInfoPropsFromState {
  quizTexts: IQuizText
  changeAttr: (attr: string, attrValue: string | number) => void
}

interface IQuizInfoState {
  expanded: boolean
  redirect: any
  initialCorrected: boolean
}

class QuizInfo extends React.Component<IQuizInfoProps, IQuizInfoState> {
  public constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      redirect: null,
      initialCorrected: false,
    }
  }

  public componentDidMount() {
    this.setState({
      expanded: !this.props.quizHasBeenSaved,
    })
  }

  public componentDidUpdate() {
    if (!this.state.initialCorrected) {
      this.setState({
        initialCorrected: true,
        expanded: !this.props.quizHasBeenSaved,
      })
    }
  }

  public render() {
    if (this.state.redirect) {
      return <Redirect to={`courses/${this.props.currentCourseId}`} />
    }
    return (
      <Grid
        container={true}
        justify="flex-start"
        alignItems="center"
        spacing={8}
      >
        <Grid item={true} xs={3} />
        <Grid item={true} xs={6} style={{ textAlign: "center" }}>
          <Typography variant="h4" style={{ textDecoration: "underline" }}>
            Basic information
          </Typography>
        </Grid>
        <Grid item={true} xs={3} />
        <Grid item={true} xs={12}>
          {this.state.expanded ? (
            <ExpandedQuizInfo
              filterLanguage={this.props.filter.language}
              courseLanguages={this.props.courseLanguages}
              quizTexts={this.props.quizTexts}
              onExpand={this.toggleExpansion}
              onCancel={
                this.props.quizHasBeenSaved
                  ? this.toggleExpansion
                  : this.redirectToCoursePage
              }
              setAttribute={this.setQuizAttribute}
              part={this.props.part}
              section={this.props.section}
              includesEssay={this.props.includesEssay}
              courseId={this.props.currentCourseId}
              courses={this.props.courses}
            />
          ) : (
            <ShortQuizInfo
              filterLanguage={this.props.filter.language}
              courseLanguages={this.props.courseLanguages}
              title={this.props.quizTexts && this.props.quizTexts.title}
              body={this.props.quizTexts && this.props.quizTexts.body}
              onExpand={this.toggleExpansion}
              tries={this.props.edit.tries}
              triesLimited={this.props.edit.triesLimited}
            />
          )}
        </Grid>
      </Grid>
    )
  }

  public toggleExpansion = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }

  public setQuizAttribute = (
    attributeName: string,
    attributeValue: string | number,
  ) => {
    if (
      attributeName === "part" ||
      attributeName === "section" ||
      attributeName === "courseId"
    ) {
      this.props.changeAttr(attributeName, attributeValue)
    } else {
      this.props.changeAttr(`texts[0].${attributeName}`, attributeValue)
    }
  }

  public redirectToCoursePage = () => {
    this.setState({
      redirect: this.props.currentCourseId,
    })
  }
}

const mapStateToProps = (state: any): IQuizInfoPropsFromState => {
  return {
    filter: state.filter,
    courseLanguages: state.edit.course.languages,
    //   quizTexts: state.edit.texts[0],
    part: state.edit.part,
    section: state.edit.section,
    includesEssay: state.edit.items.some(i => i.type === "essay"),
    courses: state.courses,
    currentCourseId: state.filter.course,
    quizHasBeenSaved: state.edit.id ? true : false,
    edit: state.edit,
  }
}

export default connect(
  mapStateToProps,
  { changeAttr },
)(QuizInfo)
