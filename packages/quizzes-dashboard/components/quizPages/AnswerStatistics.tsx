import React from "react"
import { useRouter } from "next/router"
import { QetQuizAnswerStatistics } from "../../services/quizzes"
import styled from "styled-components"
import { Typography } from "@mui/material"
import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import useSWR from "swr"
import _ from "lodash"

ChartJS.register(ArcElement, Tooltip, Legend)

const AnswerStatsContainer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
`

export const AnswerStatistics = () => {
  const router = useRouter()
  const quizId = router.query.quizId?.toString() ?? ""

  const { data: stats, error: statsError } = useSWR(
    quizId ? ["answerStatistics", quizId] : null,
    ([, id]) => QetQuizAnswerStatistics(id),
  )
  if (statsError) {
    return <>Something went wrong while fetching answer statistics</>
  }
  if (!stats) {
    return <>loading...</>
  }

  const statswithoutTotal = _.clone(stats)

  delete statswithoutTotal["total"]

  const pieChartData: ChartData<"doughnut"> = {
    labels: Object.keys(statswithoutTotal).map(
      label =>
        `${label} | ${stats[label]}; ${(
          (stats[label] / stats["total"]) *
          100
        ).toFixed(3)}%`,
    ),
    datasets: [
      {
        data: Object.values(statswithoutTotal),
        backgroundColor: [
          "#d32f2f",
          "#673ab7",
          "#1976d2",
          "#4caf50",
          "#ffeb3b",
          "#ff5722",
          "#64dd17",
          "#e91e63",
          "#3f51b5",
          "#00bcd4",
          "#8bc34a",
          "#ffc107",
        ],
        borderColor: "rgba(0, 0 , 0, 1)",
      },
    ],
  }

  const chartOptions: ChartOptions<"doughnut"> = {
    aspectRatio: 2,
    plugins: {
      legend: {
        position: "left",
        labels: { font: { size: 15 } },
      },
    },
  }

  return (
    <>
      <AnswerStatsContainer>
        <Typography variant="h3">Total: {stats["total"]}</Typography>
        <Doughnut data={pieChartData} options={chartOptions} />
      </AnswerStatsContainer>
    </>
  )
}

export default AnswerStatistics
