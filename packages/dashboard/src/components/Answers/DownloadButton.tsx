import { Button, CircularProgress } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import * as XLSX from "xlsx"
import { Quiz } from "../../../../../dist/common/src/models"

class DownloadButton extends React.Component<
  {
    label: string
    service: (qId: any, user: any) => Promise<any>
    filenameEnd: string
    fileFormat?: string
    quiz: Quiz
    user: any
  },
  { downloading: boolean; processing: boolean }
> {
  constructor(props) {
    super(props)
    this.state = {
      downloading: false,
      processing: false,
    }
  }

  public render() {
    if (this.state.downloading) {
      return (
        <CircularProgress
          style={{
            color: "#1d6f42",
          }}
        />
      )
    } else if (this.state.processing) {
      return (
        <CircularProgress
          style={{
            color: "brown",
          }}
        />
      )
    }

    return (
      <Button
        onClick={this.handleDownloadClick}
        fullWidth={true}
        variant="contained"
        size="small"
        style={{
          backgroundColor: "#1D6F42",
          color: "white",
        }}
      >
        {this.props.label} (.{this.props.fileFormat || "csv"})
      </Button>
    )
  }

  public handleDownloadClick = async () => {
    this.setState({
      downloading: true,
    })

    const wb = XLSX.utils.book_new()

    if (this.props.fileFormat) {
      const { answers, peerReviews, quizInfo } = await this.props.service(
        this.props.quiz.id,
        this.props.user,
      )

      this.setState({
        downloading: false,
        processing: true,
      })

      const wsQuizGeneral = XLSX.utils.json_to_sheet(quizInfo.plainInfo)
      const wsQuizItems = XLSX.utils.json_to_sheet(quizInfo.plainItems)
      const wsQuizOptions = XLSX.utils.json_to_sheet(quizInfo.plainOptions)
      const wsQuizPeerReviewCollections = XLSX.utils.json_to_sheet(
        quizInfo.plainPeerReviewCollections,
      )
      const wsQuizPeerReviewQuestions = XLSX.utils.json_to_sheet(
        quizInfo.plainPeerReviewQuestions,
      )

      const wsAnswersPlain = XLSX.utils.json_to_sheet(answers.plainAnswers)
      const wsItemAnswersPlain = XLSX.utils.json_to_sheet(
        answers.plainItemAnswers,
      )
      const wsOptionAnswersPlain = XLSX.utils.json_to_sheet(
        answers.plainOptionAnswers,
      )

      const wsPeerReviewsPlain = XLSX.utils.json_to_sheet(
        peerReviews.plainPeerReviews,
      )

      const wsPeerReviewQuestionAnswersPlain = XLSX.utils.json_to_sheet(
        peerReviews.plainPeerReviewQuestionAnswers,
      )

      XLSX.utils.book_append_sheet(wb, wsQuizGeneral, "quiz info")
      XLSX.utils.book_append_sheet(wb, wsQuizItems, "items")
      XLSX.utils.book_append_sheet(wb, wsQuizOptions, "item options")
      XLSX.utils.book_append_sheet(
        wb,
        wsQuizPeerReviewCollections,
        "peer review collections",
      )
      XLSX.utils.book_append_sheet(
        wb,
        wsQuizPeerReviewQuestions,
        "peer review questions",
      )

      XLSX.utils.book_append_sheet(wb, wsAnswersPlain, "answers")

      XLSX.utils.book_append_sheet(wb, wsItemAnswersPlain, "item answers")
      XLSX.utils.book_append_sheet(wb, wsOptionAnswersPlain, "option answers")

      XLSX.utils.book_append_sheet(wb, wsPeerReviewsPlain, "peer reviews")

      XLSX.utils.book_append_sheet(
        wb,
        wsPeerReviewQuestionAnswersPlain,
        "peer review answers",
      )
    } else {
      const data = await this.props.service(this.props.quiz.id, this.props.user)

      this.setState({
        downloading: false,
        processing: true,
      })
      const ws = XLSX.utils.json_to_sheet(data)
      await XLSX.utils.book_append_sheet(wb, ws, "sheet 0")
    }

    XLSX.writeFile(
      wb,
      `${this.props.quiz.texts[0].title}_${this.props.filenameEnd}.${this.props
        .fileFormat || "csv"}`,
    )

    this.setState({
      processing: false,
    })
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(DownloadButton)
