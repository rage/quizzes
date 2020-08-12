import React from "react"
import {
  fetchCourseQuizzes,
  getAnswersRequiringAttentionCounts,
} from "../../services/quizzes"
import { groupBy, Dictionary } from "lodash"
import { Typography, Card, CardContent, Button } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import DebugDialog from "../../components/DebugDialog"
import Link from "next/link"
import styled from "styled-components"
import useSWR from "swr"
import { useRouter } from "next/router"
import { Quiz } from "../../types/Quiz"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import DuplicateCourseButton from "../../components/DuplicateCourse"
import Head from "next/head"
import usePromise from "react-use-promise"

const QuizCard = styled(Card)`
  margin-bottom: 1rem;
`

const QuizLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`
const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const CourseTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledType = styled(Typography)`
  color: #f44336 !important;
`

const ShowCoursePage = () => {
  const router = useRouter()
  const id = router.query.courseId?.toString() ?? ""
  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    { label: "Course" },
  ])
  const { data, error } = useSWR(id, fetchCourseQuizzes)
  const [answersRequiringAttention, answersError] = usePromise(
    () => getAnswersRequiringAttentionCounts(id),
    [],
  )

  if (error || answersError) {
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
  if (!data || !answersRequiringAttention) {
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

  const requirinAttention = answersRequiringAttention
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
        <Typography variant="h3">Edit {course.title}</Typography>
        <Link
          href={{
            pathname: "/courses/[id]/quizzes/new",
            query: { courseId: `${id}` },
          }}
          as={`/courses/${id}/quizzes/new`}
        >
          <Button variant="outlined">
            <Typography variant="overline">Add New Quiz</Typography>
          </Button>
        </Link>
      </CourseTitleWrapper>
      {Object.entries(byPartAndSection).map(([part, section]) => (
        <div key={part}>
          <Typography variant="h4">Part {part}</Typography>
          {Object.entries(section).map(([section, quizzes]) => {
            return (
              <SectionOfPart
                key={part + "-" + section}
                section={section}
                quizzes={quizzes}
                requiringAttention={requirinAttention}
              />
            )
          })}
        </div>
      ))}
      <DuplicateCourseButton course={course} />
      <DebugDialog />
    </>
  )
}

interface sectionProps {
  section: string
  quizzes: Quiz[]
  requiringAttention: { [quizId: string]: number }
}

const SectionOfPart = ({
  section,
  quizzes,
  requiringAttention,
}: sectionProps) => {
  return (
    <>
      <Typography variant="h6">Section {section}</Typography>
      {quizzes.map(quiz => {
        return (
          <QuizOfSection
            key={quiz.id}
            quiz={quiz}
            requirinAttention={requiringAttention[quiz.id]}
          />
        )
      })}
    </>
  )
}

interface quizProps {
  quiz: Quiz
  requirinAttention: number
}

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const QuizOfSection = ({ quiz, requirinAttention }: quizProps) => {
  const title = quiz.title
  const types = Array.from(new Set(quiz.items.map(item => item.type)))
  return (
    <Link
      href={{
        pathname: "/quizzes/[quizId]/overview",
        query: { quizId: `${quiz.id}` },
      }}
      as={`/quizzes/${quiz.id}/overview`}
    >
      <QuizLink>
        <QuizCard color={requirinAttention > 0 ? "red" : "inherit"}>
          <CardContent>
            <TitleContainer>
              <Typography display="block" color="inherit" variant="body1">
                {title}
              </Typography>
              {requirinAttention > 0 ? (
                <Typography>
                  Answers requiring attention: {requirinAttention}
                </Typography>
              ) : (
                ""
              )}
            </TitleContainer>
            <div>
              <Typography variant="overline" color="secondary"></Typography>
            </div>
            {types.length > 0 ? (
              <div>
                [{" "}
                {types.map(type => (
                  <StyledType variant="overline">{type} </StyledType>
                ))}
                ]
              </div>
            ) : (
              ""
            )}
          </CardContent>
        </QuizCard>
      </QuizLink>
    </Link>
  )
}

export default ShowCoursePage
