import React, { useEffect, useState } from "react"
import { faChalkboard, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tab, Tabs, Typography } from "@material-ui/core"
import { ITabToComponent } from "../CoursePage/types"
import { CoursePage } from "../CoursePage"
import EditCourseDetails from "../CoursePage/EditDetailsForm"
import { useRouter } from "next/router"
import { useUserAbilities } from "../../hooks/useUserAbilities"

const CourseTabNavigator = () => {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState("listing")
  const courseId = router.query.courseId?.toString() ?? ""

  const URL_HREF = `/courses/[courseId]/[...page]`
  const pathname = `/courses/${courseId}`

  const {
    userAbilities,
    userAbilitiesLoading,
    userAbilitiesError,
  } = useUserAbilities(courseId ?? "", "user-abilities")

  const coursePageTabs: ITabToComponent = {
    listing: CoursePage,
    edit: EditCourseDetails,
    default_tab: CoursePage,
  }

  const ComponentTag = coursePageTabs[currentTab]
    ? coursePageTabs[currentTab]
    : coursePageTabs["default_tab"]

  useEffect(() => {
    if (router.query.page) {
      setCurrentTab(router.query.page[0])
    }
  }, [router.query.page])

  return (
    <>
      <Tabs
        variant="fullWidth"
        value={currentTab}
        indicatorColor="primary"
        textColor="primary"
        style={{ marginBottom: "3rem" }}
      >
        <Tab
          key="listing"
          icon={<FontAwesomeIcon icon={faChalkboard} />}
          value="listing"
          label={<Typography>Part Listing</Typography>}
          onClick={() => {
            router.push(URL_HREF, `${pathname}/listing`)
            setCurrentTab("listing")
          }}
        />
        {userAbilities?.includes("edit") && (
          <Tab
            key="edit"
            icon={<FontAwesomeIcon icon={faPen} />}
            value="edit"
            label={<Typography>Edit Course Details</Typography>}
            onClick={() => {
              router.push(URL_HREF, `${pathname}/edit`)
              setCurrentTab("edit")
            }}
          />
        )}
      </Tabs>
      <ComponentTag />
    </>
  )
}

export default CourseTabNavigator
