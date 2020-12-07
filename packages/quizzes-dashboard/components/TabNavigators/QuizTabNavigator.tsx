import React, { useEffect, useState } from "react"
import { Tabs, Tab, Badge, Typography } from "@material-ui/core"
import { useRouter } from "next/router"
import {
  faPen,
  faChalkboard,
  faScroll,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getAnswersRequiringAttentionByQuizId } from "../../services/quizzes"
import usePromise from "react-use-promise"
import OverView from "../QuizPages/overview"
import EditPage from "../QuizPages/edit"
import AllAnswers from "../QuizPages/answers/all"
import RequiringAttention from "../QuizPages/answers/requiring-attention"
import { ITabToComponent } from "../CoursePage/types"

export const TabNavigator = () => {
  const router = useRouter()
  const quizId = router.query.quizId?.toString() ?? ""
  const URL_HREF = `/quizzes/[quizId]/[...page]`
  const pathname = `/quizzes/${quizId}`

  const [requiringAttention, _] = usePromise(
    () => getAnswersRequiringAttentionByQuizId(quizId),
    [quizId],
  )
  const [currentPage, setCurrentPage] = useState("overview")

  useEffect(() => {
    const { page } = router.query
    if (page) {
      setCurrentPage(page as string)
    }
  }, [router.query.page])

  const quizTabs: ITabToComponent = {
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
          key="overview"
          icon={<FontAwesomeIcon icon={faChalkboard} />}
          value="overview"
          label={<Typography>Overview</Typography>}
          onClick={() => {
            router.push(URL_HREF, `${pathname}/overview`)
            setCurrentPage("overview")
          }}
        />
        <Tab
          key="edit"
          icon={<FontAwesomeIcon icon={faPen} />}
          value="edit"
          label={<Typography>Edit quiz</Typography>}
          onClick={() => {
            router.push(URL_HREF, `${pathname}/edit`)
            setCurrentPage("edit")
          }}
        />
        <Tab
          key="all-answers"
          icon={<FontAwesomeIcon icon={faScroll} />}
          value="all-answers"
          label={<Typography>All answers</Typography>}
          onClick={() => {
            router.push(URL_HREF, `${pathname}/all-answers`)
            setCurrentPage("all-answers")
          }}
        />

        <Tab
          key="answers-requiring-attention"
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          value="answers-requiring-attention"
          label={
            <Badge
              variant="standard"
              badgeContent={requiringAttention}
              color="error"
            >
              <Typography>Answers requiring attention</Typography>
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
