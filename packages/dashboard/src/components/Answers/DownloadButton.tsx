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
  { downloading: boolean }
> {
  constructor(props) {
    super(props)
    this.state = {
      downloading: false,
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

    if (this.props.fileFormat && this.props.fileFormat !== "csv") {
      const { answers, peerReviews, quizInfo } = await this.props.service(
        this.props.quiz.id,
        this.props.user,
      )

      const wsQuiz = XLSX.utils.json_to_sheet(quizInfo)
      const wsAnswers = XLSX.utils.json_to_sheet(answers)
      const wsPeerReviews = XLSX.utils.json_to_sheet(peerReviews)

      XLSX.utils.book_append_sheet(wb, wsQuiz, "quiz info")
      XLSX.utils.book_append_sheet(wb, wsAnswers, "answers")
      XLSX.utils.book_append_sheet(wb, wsPeerReviews, "peer reviews")
    } else {
      const data = await this.props.service(this.props.quiz.id, this.props.user)
      const ws = XLSX.utils.json_to_sheet(data)
      await XLSX.utils.book_append_sheet(wb, ws, "sheet 0")
    }

    this.setState({
      downloading: false,
    })

    XLSX.writeFile(
      wb,
      `${this.props.quiz.texts[0].title}_${this.props.filenameEnd}.${this.props
        .fileFormat || "xls"}`,
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(DownloadButton)
