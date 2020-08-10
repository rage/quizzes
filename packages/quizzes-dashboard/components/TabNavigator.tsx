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

interface NavigatorProps {
  quizId: string
  value: number
}

export const TabNavigator = ({ quizId, value }: NavigatorProps) => {
  const router = useRouter()
  return (
    <>
      <Tabs
        variant="fullWidth"
        value={value}
        indicatorColor="primary"
        textColor="primary"
        aria-label="disabled tabs example"
      >
        <Tab
          icon={<FontAwesomeIcon icon={faChalkboard} />}
          value={1}
          label="Overview"
          onClick={() =>
            router.push("/quizzes/[id]/overview", `/quizzes/${quizId}/overview`)
          }
        />
        <Tab
          icon={<FontAwesomeIcon icon={faPen} />}
          value={2}
          label="Edit quiz"
          onClick={() =>
            router.push("/quizzes/[id]/edit", `/quizzes/${quizId}/edit`)
          }
        />
        <Tab
          icon={<FontAwesomeIcon icon={faScroll} />}
          value={3}
          label="All answers"
          onClick={() =>
            router.push(
              "/quizzes/[id]/answers/all",
              `/quizzes/${quizId}/answers/all`,
            )
          }
        />
        <Tab
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
          value={4}
          label="Answers requiring attention"
          onClick={() =>
            router.push(
              "/quizzes/[id]/answers/requiring-attention",
              `/quizzes/${quizId}/answers/requiring-attention`,
            )
          }
        />
      </Tabs>
    </>
  )
}

export default TabNavigator
