import React, { useState } from "react"
import { faChalkboard, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tab, Tabs } from "@material-ui/core"
import { ITabToComponent } from "../CoursePage/types"
import { CoursePage } from "../CoursePage"
import EditCourseDetails from "../CoursePage/EditDetailsForm"
import { useRouter } from "next/router"

const CourseTabNavigator = () => {
  const router = useRouter()
  const pageOnUrl = router.query.page?.[0] ?? "listing"
  const [currentTab, setCurrentTab] = useState(pageOnUrl)
  const courseId = router.query.courseId?.toString() ?? ""

  const URL_HREF = `/courses/[courseId]/[...page]`
  const pathname = `/courses/${courseId}`

  const coursePageTabs: ITabToComponent = {
    listing: CoursePage,
    edit: EditCourseDetails,
    default_tab: CoursePage,
  }

  const ComponentTag = coursePageTabs[currentTab]
    ? coursePageTabs[currentTab]
    : coursePageTabs["default_tab"]

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
          icon={<FontAwesomeIcon icon={faChalkboard} />}
          value="listing"
          label="Part Listing"
          onClick={() => {
            router.push(URL_HREF, `${pathname}/listing`)
            setCurrentTab("listing")
          }}
        />
        <Tab
          icon={<FontAwesomeIcon icon={faPen} />}
          value="edit"
          label="Edit Course Details"
          onClick={() => {
            router.push(URL_HREF, `${pathname}/edit`)
            setCurrentTab("edit")
          }}
        />
      </Tabs>
      <ComponentTag />
    </>
  )
}

export default CourseTabNavigator
