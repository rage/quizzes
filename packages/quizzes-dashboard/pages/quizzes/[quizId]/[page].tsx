import React from "react"
import { useRouter } from "next/router"
import OverView from "../../../components/quizPages/overview"
import EditPage from "../../../components/quizPages/edit"
import AllAnswers from "../../../components/quizPages/answers/all"
import RequiringAttention from "../../../components/quizPages/answers/requiring-attention"
import TabNavigator from "../../../components/TabNavigator"

export const QuizPage = (props: any) => {
  const router = useRouter()
  const page = router.query.page?.toString() ?? ""

  const { queryParams } = props

  return (
    <>
      <TabNavigator />
      {page === "overview" ? <OverView /> : ""}
      {page === "edit" ? <EditPage /> : ""}
      {page === "all-answers" ? <AllAnswers queryParams={queryParams} /> : ""}
      {page === "answers-requiring-attention" ? (
        <RequiringAttention queryParams={queryParams} />
      ) : (
        ""
      )}
    </>
  )
}

export default QuizPage

QuizPage.getInitialProps = async (context: any) => {
  return { queryParams: context.query }
}
