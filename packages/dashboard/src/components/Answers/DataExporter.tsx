import { Card, CardContent, Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { IQuiz, IUserCourseRole } from "../../interfaces"
import {
  getAnswersDetailedData,
  getDetailedEverythingData,
  getPeerReviewsDetailedData,
  getQuizInformationDetailedData,
} from "../../services/quizzes"
import DownloadButton from "./DownloadButton"

interface IDataExporterProps {
  quiz: IQuiz
  isAdmin: boolean
  courseRoles: IUserCourseRole[]
}

const DataExporter: React.FunctionComponent<IDataExporterProps> = ({
  quiz,
  isAdmin,
  courseRoles,
}) => {
  const allowedToExportData = () => {
    return isAdmin || courseRoles.some(role => role.role === "teacher")
  }

  return !allowedToExportData() ? (
    <div />
  ) : (
    <React.Fragment>
      <Grid item={true} xs={12}>
        <DownloadButton
          quiz={quiz}
          service={getQuizInformationDetailedData}
          label="Download quiz info"
          filenameEnd="information"
        />
      </Grid>
      <Grid item={true} xs={12}>
        <DownloadButton
          quiz={quiz}
          service={getAnswersDetailedData}
          label="Download quiz answers data"
          filenameEnd="answers"
        />
      </Grid>
      <Grid item={true} xs={12}>
        <DownloadButton
          quiz={quiz}
          service={getPeerReviewsDetailedData}
          label={"Download peer review data"}
          filenameEnd="peer_reviews"
        />
      </Grid>

      <Grid item={true} xs={12} style={{ marginTop: "1em" }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1">
              Note: The options below use a lot of memory to process the data
              into xlsx/ods. Firefox seems less likely to crash as a result.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item={true} xs={12}>
        <DownloadButton
          quiz={quiz}
          service={getDetailedEverythingData}
          label={"Download all quiz data"}
          fileFormat="xlsx"
          filenameEnd="data"
        />
      </Grid>
      <Grid item={true} xs={12}>
        <DownloadButton
          quiz={quiz}
          service={getDetailedEverythingData}
          label={"Download all quiz data"}
          fileFormat="ods"
          filenameEnd="data"
        />
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  isAdmin: state.user.administrator,
  courseRoles: state.user.roles.filter(
    role => role.courseId === state.filter.course,
  ),
})

export default connect(mapStateToProps)(DataExporter)
