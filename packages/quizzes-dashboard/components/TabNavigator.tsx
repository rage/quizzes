import React, { useState } from "react"
import { Tabs, Tab, Badge } from "@material-ui/core"
import { useRouter } from "next/router"
import {
  faPen,
  faChalkboard,
  faScroll,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getAnswersRequiringAttentionByQuizId } from "../services/quizzes"
import usePromise from "react-use-promise"
import OverView from "./quizPages/overview"
import EditPage from "./quizPages/edit"
import AllAnswers from "./quizPages/answers/all"
import RequiringAttention from "./quizPages/answers/requiring-attention"

interface IQuizTabs {
  [key: string]: () => JSX.Element
}

export const TabNavigator = () => {
  const router = useRouter()
  const quizId = router.query.quizId?.toString() ?? ""
  const pageOnUrl = router.query.page?.[0] ?? "overview"

  const [requiringAttention, error] = usePromise(
    () => getAnswersRequiringAttentionByQuizId(quizId),
    [quizId],
  )
  const [currentPage, setCurrentPage] = useState<string>(pageOnUrl)

  const URL_HREF = `/quizzes/[quizId]/[...page]`
  const pathname = `/quizzes/${quizId}`

  const quizTabs: IQuizTabs = {
    overview: OverView,
    edit: EditPage,
    "all-answers": AllAnswers,
    "answers-requiring-attention": RequiringAttention,
    default_tab: OverView,
  }

  const ComponentTag = quizTabs[currentPage]
    ? quizTabs[currentPage]
    : quizTabs["default_tab"]
  return (
    <>
      <Tabs
        variant="fullWidth"
        value={currentPage}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab
          icon={<FontAwesomeIcon icon={faChalkboard} />}
          value="overview"
          label="Overview"
          onClick={() => {
            router.push(URL_HREF, `${pathname}/overview`)
            setCurrentPage("overview")
          }}
        />
        <Tab
          icon={<FontAwesomeIcon icon={faPen} />}
          value="edit"
          label="Edit quiz"
          onClick={() => {
            router.push(URL_HREF, `${pathname}/edit`)
            setCurrentPage("edit")
          }}
        />
        <Tab
          icon={<FontAwesomeIcon icon={faScroll} />}
          value="all-answers"
          label="All answers"
          onClick={() => {
            router.push(URL_HREF, `${pathname}/all-answers`)
            setCurrentPage("all-answers")
          }}
        />

        <Tab
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          value="answers-requiring-attention"
          label={
            <Badge
              variant="standard"
              badgeContent={requiringAttention}
              color="error"
            >
              Answers requiring attention
            </Badge>
          }
          onClick={() => {
            router.push(URL_HREF, `${pathname}/answers-requiring-attention`)
            setCurrentPage("answers-requiring-attention")
          }}
        />
      </Tabs>
      <ComponentTag />
    </>
  )
}

export default TabNavigator
