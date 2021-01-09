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
import OverView from "../quizPages/overview"
import EditPage from "../quizPages/edit"
import AllAnswers from "../quizPages/answers/all"
import RequiringAttention from "../quizPages/answers/requiring-attention"
import { ITabToComponent } from "../CoursePage/types"
import { AnswerListProvider } from "../../contexts/AnswerListContext"
import { useQuiz } from "../../hooks/useQuiz"
import { useCourse } from "../../hooks/useCourse"
import { useUserAbilities } from "../../hooks/useUserAbilities"
import { TabTextError, TabTextLoading } from "../quizPages/TabHeaders"
import SkeletonLoader from "../Shared/SkeletonLoader"
import { useAnswersRequiringAttentionCount } from "../../hooks/useAnswersRequiringAttention"

export const TabNavigator = () => {
  const router = useRouter()
  const quizId = router.query.quizId?.toString() ?? ""
  const URL_HREF = `/quizzes/[quizId]/[...page]`
  const pathname = `/quizzes/${quizId}`

  /* tokens passed to hooks are for swr caching  */
  const { quiz, quizLoading, quizError } = useQuiz(quizId, "quiz")
  const { course, courseLoading, courseError } = useCourse(
    quiz?.courseId ?? "",
    "course",
  )
  const {
    userAbilities,
    userAbilitiesLoading,
    userAbilitiesError,
  } = useUserAbilities(quiz?.courseId ?? "", "user-abilities")
  const {
    requiringAttention,
    requiringAttentionLoading,
    requiringAttentionError,
  } = useAnswersRequiringAttentionCount(quizId, "requiring-attention")

  const [currentTab, setCurrentTab] = useState("overview")

  /* for when tab is loaded through url*/
  useEffect(() => {
    if (router.query.page) {
      setCurrentTab(router.query.page[0])
    }
  }, [router])

  /* dynamically map tabs to their respective contents */
  const quizTabs: ITabToComponent = {
    overview: OverView,
    edit: EditPage,
    "all-answers": AllAnswers,
    "answers-requiring-attention": RequiringAttention,
    default_tab: OverView,
  }

  const dataIsBeingFetched =
    quizLoading ||
    userAbilitiesLoading ||
    courseLoading ||
    requiringAttentionLoading

  const errorFetchingData =
    quizError || courseError || userAbilitiesError || requiringAttentionError

  const ComponentTag = quizTabs[currentTab]
    ? quizTabs[currentTab]
    : quizTabs["default_tab"]

  return (
    <>
      <Tabs
        variant="fullWidth"
        value={currentTab}
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
            setCurrentTab("overview")
          }}
        />
        <Tab
          key="edit"
          icon={<FontAwesomeIcon icon={faPen} />}
          value="edit"
          label={<Typography>Edit quiz</Typography>}
          onClick={() => {
            router.push(URL_HREF, `${pathname}/edit`)
            setCurrentTab("edit")
          }}
        />
        <Tab
          key="all-answers"
          icon={<FontAwesomeIcon icon={faScroll} />}
          value="all-answers"
          label={<Typography>All answers</Typography>}
          onClick={() => {
            router.push(URL_HREF, `${pathname}/all-answers`)
            setCurrentTab("all-answers")
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
            setCurrentTab("answers-requiring-attention")
          }}
        />
      </Tabs>
      {errorFetchingData ? (
        <TabTextError />
      ) : dataIsBeingFetched ? (
        <>
          <TabTextLoading />
          <SkeletonLoader height={250} skeletonCount={1} />
        </>
      ) : (
        <AnswerListProvider>
          <ComponentTag
            quiz={quiz}
            course={course}
            userAbilities={userAbilities}
          />
        </AnswerListProvider>
      )}
    </>
  )
}

export default TabNavigator
