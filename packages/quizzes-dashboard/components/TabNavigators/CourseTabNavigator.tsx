import React, { useEffect, useState } from "react"

import { useRouter } from "next/router"

import {
  faClipboardList,
  faPenSquare,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tab, Tabs, Typography } from "@mui/material"

import { useUserAbilities } from "../../hooks/useUserAbilities"
import CompletionPage from "../CompletionPage"
import { CoursePage } from "../CoursePage"
import EditCourseDetails from "../CoursePage/EditDetailsForm"
import { ITabToComponent } from "../CoursePage/types"

const CourseTabNavigator = () => {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState("listing")
  const courseId = router.query.courseId?.toString() ?? ""

  const pathname = `/courses/${courseId}`

  const { userAbilities, userAbilitiesLoading, userAbilitiesError } =
    useUserAbilities(courseId ?? "", "user-abilities")

  const coursePageTabs: ITabToComponent = {
    listing: CoursePage,
    edit: EditCourseDetails,
    completion: CompletionPage,
    default_tab: CoursePage,
  }

  const canEdit = userAbilities?.includes("edit")
  const isCurrentTabRendered =
    currentTab === "listing" ||
    (canEdit && (currentTab === "edit" || currentTab === "completion"))

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
        value={isCurrentTabRendered ? currentTab : false}
        indicatorColor="primary"
        textColor="primary"
        style={{ marginBottom: "3rem" }}
      >
        <Tab
          key="listing"
          icon={<FontAwesomeIcon icon={faClipboardList} />}
          value="listing"
          label={<Typography>Part Listing</Typography>}
          onClick={() => {
            router.push(`${pathname}/listing`, undefined, { shallow: true })
          }}
        />
        {canEdit && (
          <Tab
            key="edit"
            icon={<FontAwesomeIcon icon={faPenSquare} />}
            value="edit"
            label={<Typography>Course Details</Typography>}
            onClick={() => {
              router.push(`${pathname}/edit`, undefined, { shallow: true })
            }}
          />
        )}
        {canEdit && (
          <Tab
            key="completion"
            icon={<FontAwesomeIcon icon={faUsersCog} />}
            value="completion"
            label={<Typography>Completion settings</Typography>}
            onClick={() => {
              router.push(`${pathname}/completion`, undefined, {
                shallow: true,
              })
            }}
          />
        )}
      </Tabs>
      <ComponentTag />
    </>
  )
}

export default CourseTabNavigator
