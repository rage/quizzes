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
import DebugDialog from "../DebugDialog"
import Link from "next/link"
import styled from "styled-components"
import { useRouter } from "next/router"
import { Quiz } from "../../types/Quiz"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import DuplicateCourseButton from "../DuplicateCourse"
import { SectionOfPart } from "./PartSection"
import SkeletonLoader from "../Shared/SkeletonLoader"

const CourseTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media only screen and (max-width: 535px) {
    flex-wrap: wrap;
  }
`

const StyledButton = styled(Button)`
  max-height: 3rem;
  @media only screen and (max-width: 535px) {
    align-self: flex-end !important;
  }
`

const POINT_COLOR = "#505050"

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
    { label: "Courses", as: "/" },
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
        <SkeletonLoader height={50} skeletonCount={15} />
      </>
    )
  }

  const requiringAttention = answersRequiringAttention
  const quizzes = data.quizzes
  const course = data.course
  const byPart = groupBy(quizzes, "part")
  const pointsByParts: { [part: number]: number } = {}
  let byPartAndSection: Record<string, Dictionary<Quiz[]>> = {}
  for (let [part, quizzes] of Object.entries(byPart)) {
    byPartAndSection[part] = groupBy(quizzes, "section")
    pointsByParts[parseInt(part)] = quizzes
      .filter(quiz => !quiz.excludedFromScore)
      .map(quiz => quiz.points)
      .reduce((a, b) => a + b, 0)
  }

  let points = data.quizzes
    .filter(quiz => !quiz.excludedFromScore && quiz.part !== 0)
    .map(quiz => quiz.points)
    .reduce((a, b) => a + b, 0)

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
        <Typography style={{fontWeight: 'bold'}} variant="h3" component="h1">
          {course.title}
          <Typography style={{ color: POINT_COLOR, fontSize: "20px" }}>
            (Max points: {points})
          </Typography>
        </Typography>

        <Link href={`/courses/${id}/quizzes/new`}>
          <StyledButton variant="outlined">
            <Typography variant="overline">Add New Quiz</Typography>
          </StyledButton>
        </Link>
      </CourseTitleWrapper>
      {Object.entries(byPartAndSection)
        .sort((a, b) => {
          // sorts part 0 as last because it's the part for deleted quizzes
          const first = Number(a[0])
          const second = Number(b[0])
          return zeroIsInfinity(first) - zeroIsInfinity(second)
        })
        .map(([part, section]) => (
          <div key={part}>
            <Typography variant="h4">
              Part {part}{" "}
              {part === "0" ? (
                <span>(Deleted)</span>
              ) : (
                <span style={{ color: POINT_COLOR, fontSize: "14px" }}>
                  (Points: {pointsByParts[parseInt(part)]})
                </span>
              )}
            </Typography>
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
      {userAbilities.includes("duplicate") ? (
        <DuplicateCourseButton course={course} />
      ) : (
        ""
      )}
      <DebugDialog object={course} />
    </>
  )
}

function zeroIsInfinity(value: number): number {
  return value === 0 ? Infinity : value
}

export default CoursePage
