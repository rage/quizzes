import { Button, Card, Grid, Typography } from "@material-ui/core"
import queryString from "query-string"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { setAttentionRequiringAnswers } from "../store/answers/actions"
import { setAnswerStatistics } from "../store/answerStatistics/actions"
import { setCourse } from "../store/filter/actions"
import LanguageBar from "./GeneralTools/LanguageBar"

class QuizStatistics extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
    }
  }

  public componentDidMount() {
    this.props.setAttentionRequiringAnswers(this.props.match.params.id)
    this.props.setAnswerStatistics(this.props.match.params.id)
  }

  public render() {
    const queryParams = queryString.parse(this.props.location.search)
    const showingAll = queryParams.all && queryParams.all === "true"

    const quiz = this.props.quizzes.find(
      c => c.id === this.props.match.params.id,
    )
    const currentCourse = this.props.courses.find(
      c => c.id === this.props.filter.course,
    )

    if (!quiz) {
      return <p />
    }
    return (
      <Grid container={true} justify="center" alignItems="center" spacing={16}>
        <Grid item={true} xs={10}>
          <Grid
            container={true}
            direction="row-reverse"
            justify="center"
            alignItems="stretch"
            spacing={16}
          >
            <Grid item={true} xs="auto">
              <Typography variant="title">
                {currentCourse &&
                  currentCourse.texts[0] &&
                  currentCourse.texts[0].title.toUpperCase()}
              </Typography>
              <Typography variant="subtitle1">
                Part {quiz.part} section {quiz.section}
              </Typography>
              <Typography variant="subtitle1">{quiz.texts[0].title}</Typography>
            </Grid>

            <LanguageBar />

            <Grid item={true} xs={12} md={4} style={{ marginBottom: "1em" }}>
              <GeneralStatistics
                answers={this.props.answers}
                answerStatistics={this.props.answerStatistics}
              />
            </Grid>

            <Grid item={true} xs={12} md={8}>
              <AttentionAnswers answers={this.props.answers} quiz={quiz} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const AttentionAnswers = ({ answers, quiz }) => {
  const placeHolder = [
    [
      {
        title: "Name",
        type: "Test quiz type",
        answer: "I am very unsure",
      },
      {
        title: "Select the correct",
        type: "multiple-choice",
        selected: "wrong",
        correctOption: "right",
      },
    ],
  ]

  return (
    <Grid container={true} justify="flex-start" spacing={24}>
      <Grid
        item={true}
        xs={10}
        style={{ marginBottom: "1em", textAlign: "center" }}
      >
        <Typography variant="title">ANSWERS REQUIRING ATTENTION</Typography>
      </Grid>
      <Grid item={true} xs={2}>
        <Link to={`/quizzes/${quiz.id}/answers?all=true`}>
          <Typography color="textPrimary">VIEW ALL</Typography>
        </Link>
      </Grid>

      {answers.map((answer, idx) => {
        return (
          <AnswerComponent
            key={answer.id}
            answerData={answer}
            idx={idx}
            quiz={quiz}
          />
        )
      })}
    </Grid>
  )
}

class AnswerComponent extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
    return (
      <Grid
        item={true}
        xs={12}
        style={{ marginRight: "1em" }}
        onMouseEnter={this.showMore}
        onMouseLeave={this.showLess}
      >
        <Card
          raised={true}
          square={true}
          style={{ borderLeft: "1em solid #FB6949" }}
        >
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <ItemAnswerComponent
                idx={this.props.idx}
                answer={this.props.answerData}
                quiz={this.props.quiz}
              />
            </Grid>

            {this.state.expanded && (
              <DetailedAnswerData
                answer={this.props.answerData}
                itemStatistics={[
                  { avg: 0.7, sd: 0.13 },
                  { avg: 0.91, sd: 0.2 },
                ]}
              />
            )}

            <Grid item={true} xs={12} style={{ backgroundColor: "#E5E5E5" }}>
              <Grid
                container={true}
                spacing={8}
                justify="space-between"
                style={{ margin: ".5em .25em .25em .25em" }}
              >
                <Grid item={true} xs={4} md={3}>
                  <Grid container={true} spacing={16}>
                    <Grid item={true} xs={6}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#029422",
                          borderRadius: "0",
                          color: "white",
                        }}
                      >
                        Accept
                      </Button>
                    </Grid>

                    <Grid item={true} xs={6}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#D80027",
                          borderRadius: "0",
                          color: "white",
                        }}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item={true} xs={2} style={{ textAlign: "center" }}>
                  <Typography>Avg: 3,14</Typography>

                  <Typography>SD: 1,00</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  private showMore = () => {
    this.setState({
      expanded: true,
    })
  }

  private showLess = () => {
    this.setState({
      expanded: false,
    })
  }
}

const DetailedAnswerData = ({ answer, itemStatistics }) => {
  return (
    <Grid item={true} xs={12} style={{ margin: "0em 0em 1em 1em" }}>
      <Grid
        container={true}
        justify="flex-start"
        alignItems="stretch"
        spacing={16}
      >
        <Grid
          item={true}
          xs={12}
          md={3}
          style={{ borderRight: "1px dashed #9D9696" }}
        >
          <Typography variant="subtitle1" color="textSecondary">
            SPAM FLAGS: XX
          </Typography>
          <Link to={`/answers/${answer.id}`}>VIEW PEER REVIEWS</Link>
        </Grid>

        <Grid item={true} xs={12} md={9}>
          <Grid
            container={true}
            alignItems="center"
            spacing={24}
            style={{ marginBottom: "2em" }}
          >
            <Grid item={true} xs={4} lg={3} xl={2} />
            <Grid item={true} xs={4}>
              <Typography variant="subtitle1">AVERAGE POINTS</Typography>
            </Grid>
            <Grid item={true} xs={4}>
              <Typography variant="subtitle1">STANDARD DEVIATION</Typography>
            </Grid>
            <Grid item={true} xs="auto" lg={1} xl={2} />

            {answer.itemAnswers.map((ia, idx) => {
              return (
                <React.Fragment key={ia.quizItemId}>
                  <Grid item={true} xs={4} lg={3} xl={2}>
                    QUESTION {idx + 1}:
                  </Grid>
                  <Grid item={true} xs={4}>
                    {itemStatistics.length >= idx + 1
                      ? itemStatistics[idx].avg
                      : -1}
                  </Grid>
                  <Grid item={true} xs={4}>
                    {itemStatistics.length > idx ? itemStatistics.sd : -1}
                  </Grid>
                  <Grid item={true} xs="auto" lg={1} xl={2} />
                </React.Fragment>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const ItemAnswerComponent = ({ answer, idx, quiz }) => {
  return (
    <Grid
      container={true}
      alignItems="flex-start"
      style={{
        marginLeft: ".5em",
      }}
    >
      {quiz.items.map((qItem, qIdx) => {
        const isFirst = qIdx === 0
        const isLast = qIdx === quiz.items.length - 1

        return (
          <React.Fragment key={qItem.id}>
            <Grid item={true} xs={12} md={8}>
              <Typography variant="subtitle1">
                Question {qIdx}: {qItem.texts[0].title}
              </Typography>
            </Grid>

            <Grid item={true} xs={6} md={2}>
              <Typography variant="body1" style={{ color: "#9D9696" }}>
                Type: {qItem.type}
              </Typography>
            </Grid>

            {isFirst && (
              <Grid item={true} xs={6} md={2} style={{ textAlign: "center" }}>
                <Typography variant="body1">0 / {quiz.items.length}</Typography>
              </Grid>
            )}

            <Grid item={true} xs={12} md={10} style={{ marginTop: "1em" }}>
              {qItem.type === "essay" ? (
                <Typography variant="body1">
                  {answer.itemAnswers[qIdx].textData}
                </Typography>
              ) : (
                "Only essay type supported atm"
              )}
            </Grid>

            <Grid
              item={true}
              xs={12}
              style={{
                borderBottom: isLast ? "none" : "1px dashed #9D9696",
                margin: ".5em 0em .5em 0em",
              }}
            />
          </React.Fragment>
        )
      })}
    </Grid>
  )
}

// about the quiz & all the answers to it
const GeneralStatistics = ({ answers, answerStatistics }) => {
  return (
    <React.Fragment>
      <Grid
        item={true}
        xs={12}
        style={{ marginBottom: "1.5em", textAlign: "center" }}
      >
        <Typography variant="title">QUIZ STATISTICS</Typography>
      </Grid>

      <Grid
        container={true}
        spacing={32}
        style={{ backgroundColor: "#49C7FB" }}
      >
        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Answers requiring attention: {answers.length}
          </Typography>
        </Grid>

        <Grid item={true} xs={12}>
          <Typography variant="body1">Of those:</Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Deprecated:{" "}
                {answers.filter(a => a.status === "deprecated").length}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Spam: {answers.filter(a => a.status === "spam").length}{" "}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Rejected: {answers.filter(a => a.status === "rejected").length}
              </Typography>
            </li>
          </ul>
        </Grid>

        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Submissions: {answerStatistics.count || "-"}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Mean: {answerStatistics.average || "-"}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography variant="body1">
            Sd: {answerStatistics.stddev_pop || "-"}
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          Waiting for peer review: xx
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state: any) => {
  return {
    answers: state.answers,
    answerStatistics: state.answerStatistics,
    quizzes: state.quizzes,
    courses: state.courses,
    filter: state.filter,
  }
}

export default connect(
  mapStateToProps,
  { setAnswerStatistics, setAttentionRequiringAnswers, setCourse },
)(QuizStatistics)
