import React from "react"
import {
  fetchCourseQuizzes,
  getAnswersRequiringAttentionCounts,
  getUserAbilitiesForCourse,
} from "../../services/quizzes"
import Head from "next/head"
import usePromise from "react-use-promise"
import { groupBy, Dictionary } from "lodash"
import { Typography, Button } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import DebugDialog from "../DebugDialog"
import Link from "next/link"
import styled from "styled-components"
import { useRouter } from "next/router"
import { Quiz } from "../../types/Quiz"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import DuplicateCourseButton from "../DuplicateCourse"
import { SectionOfPart } from "./PartSection"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const CourseTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CoursePage = () => {
  const router = useRouter()
  const id = router.query.courseId?.toString() ?? ""
  const [data, error] = usePromise(() => fetchCourseQuizzes(id), [id])
  const [answersRequiringAttention, answersError] = usePromise(
    () => getAnswersRequiringAttentionCounts(id),
    [id],
  )
  const [userAbilities, userError] = usePromise(
    () => getUserAbilitiesForCourse(id),
    [id],
  )

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    { label: `${data ? data.course.title : ""}` },
  ])

  if (error || answersError || userError) {
    return (
      <>
        <div>
          <Head>
            <title>womp womp... | Quizzes</title>
            <meta
              name="quizzes"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
        </div>
        <div>Something went wrong</div>
      </>
    )
  }
  if (!data || !answersRequiringAttention || !userAbilities) {
    return (
      <>
        <div>
          <Head>
            <title>loading... | Quizzes</title>
            <meta
              name="quizzes"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
        </div>
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
      </>
    )
  }

  const requiringAttention = answersRequiringAttention
  const quizzes = data.quizzes
  const course = data.course
  const byPart = groupBy(quizzes, "part")
  let byPartAndSection: Record<string, Dictionary<Quiz[]>> = {}
  for (let [part, quizzes] of Object.entries(byPart)) {
    byPartAndSection[part] = groupBy(quizzes, "section")
  }

  return (
    <>
      <div>
        <Head>
          <title>{course.title} | Quizzes</title>
          <meta
            name="quizzes"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>
      <CourseTitleWrapper>
        <Typography
          variant="h3"
          component="h1"
          style={{ marginBottom: "0.75rem" }}
        >
          {course.title}
        </Typography>

        <Link
          href={{
            pathname: "/courses/[id]/quizzes/new",
            query: { courseId: `${id}` },
          }}
          as={`/courses/${id}/quizzes/new`}
        >
          <Button variant="outlined" style={{ maxHeight: "3rem" }}>
            <Typography variant="overline">Add New Quiz</Typography>
          </Button>
        </Link>
      </CourseTitleWrapper>
      {userAbilities.includes("duplicate") ? (
        <DuplicateCourseButton course={course} />
      ) : (
        ""
      )}
      {Object.entries(byPartAndSection).map(([part, section]) => (
        <div key={part}>
          <Typography variant="h4">Part {part}</Typography>
          {Object.entries(section).map(([section, quizzes]) => {
            return (
              <SectionOfPart
                key={part + "-" + section}
                section={section}
                quizzes={quizzes}
                requiringAttention={requiringAttention}
              />
            )
          })}
        </div>
      ))}
      <DebugDialog />
    </>
  )
}

export default CoursePage
