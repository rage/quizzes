import React from "react"
import { useRouter } from "next/router"
import OverView from "../../../components/quizPages/overview"
import EditPage from "../../../components/quizPages/edit"
import AllAnswers from "../../../components/quizPages/answers/all"
import RequiringAttention from "../../../components/quizPages/answers/requiring-attention"
import TabNavigator from "../../../components/TabNavigator"

export const QuizPage = () => {
  const router = useRouter()
  const page = router.query.page?.toString() ?? ""

  return (
    <>
      <TabNavigator />
      {page === "overview" ? <OverView /> : ""}
      {page === "edit" ? <EditPage /> : ""}
      {page === "all-answers" && <AllAnswers />}
      {page === "answers-requiring-attention" && <RequiringAttention />}
    </>
  )
}

export default QuizPage
