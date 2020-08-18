import React from "react"
import { Tabs, Tab } from "@material-ui/core"
import { useRouter } from "next/router"
import {
  faPen,
  faChalkboard,
  faScroll,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const TabNavigator = () => {
  const router = useRouter()
  const quizId = router.query.quizId?.toString() ?? ""
  const page = router.query.page
  return (
    <>
      <Tabs
        variant="fullWidth"
        value={page}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab
          icon={<FontAwesomeIcon icon={faChalkboard} />}
          value="overview"
          label="Overview"
          onClick={() =>
            router.push("/quizzes/[id]/[page]", `/quizzes/${quizId}/overview`, {
              shallow: true,
            })
          }
        />
        <Tab
          icon={<FontAwesomeIcon icon={faPen} />}
          value="edit"
          label="Edit quiz"
          onClick={() =>
            router.push("/quizzes/[id]/[page]", `/quizzes/${quizId}/edit`, {
              shallow: true,
            })
          }
        />
        <Tab
          icon={<FontAwesomeIcon icon={faScroll} />}
          value="all-answers"
          label="All answers"
          onClick={() =>
            router.push(
              "/quizzes/[id]/[page]",
              `/quizzes/${quizId}/all-answers`,
              { shallow: true },
            )
          }
        />
        <Tab
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          value="answers-requiring-attention"
          label="Answers requiring attention"
          onClick={() =>
            router.push(
              "/quizzes/[id]/[page]",
              `/quizzes/${quizId}/answers-requiring-attention`,
              { shallow: true },
            )
          }
        />
      </Tabs>
    </>
  )
}

export default TabNavigator
