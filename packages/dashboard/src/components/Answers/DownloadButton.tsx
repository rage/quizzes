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
        {this.props.label} (.csv)
      </Button>
    )
  }

  public handleDownloadClick = async () => {
    this.setState({
      downloading: true,
    })

    const data = await this.props.service(this.props.quiz.id, this.props.user)
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    await XLSX.utils.book_append_sheet(wb, ws, "1")

    this.setState({
      downloading: false,
    })
    XLSX.writeFile(
      wb,
      `${this.props.quiz.texts[0].title}_${this.props.filenameEnd}.csv`,
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(DownloadButton)
