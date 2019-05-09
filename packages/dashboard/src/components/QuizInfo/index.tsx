import { Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { changeAttr } from "../../store/edit/actions"
import ExpandedQuizInfo from "./ExpandedQuizInfo"
import ShortQuizInfo from "./ShortQuizInfo"

class QuizInfo extends React.Component<any, any> {
  public constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
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
}

const mapStateToProps = (state: any) => {
  return {
    filter: state.filter,
    courseLanguages: state.edit.course.languages,
    quizTexts: state.edit.texts[0],
    part: state.edit.part,
    section: state.edit.section,
    includesEssay: state.edit.items.some(i => i.type === "essay"),
    courses: state.courses,
    currentCourseId: state.edit.courseId,
  }
}

export default connect(
  mapStateToProps,
  { changeAttr },
)(QuizInfo)
