import { Button } from "@material-ui/core"
import React from "react"
import * as XLSX from "xlsx"
import { getCSVData } from "../../services/quizzes"

const DownloadButton = ({ quiz, user }) => {
  const handleDownloadClick = async () => {
    const data = await getCSVData(quiz.id, user)

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    await XLSX.utils.book_append_sheet(wb, ws, "1")

    XLSX.writeFile(wb, `${quiz.texts[0].title}_answers.csv`)
  }

  return (
    <Button
      onClick={handleDownloadClick}
      variant="contained"
      style={{
        backgroundColor: "#1D6F42",
        color: "white",
      }}
    >
      Download answers data (.csv)
    </Button>
  )
}

export default DownloadButton
