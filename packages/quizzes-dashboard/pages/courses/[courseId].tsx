import React from "react"
import {
  fetchCourseQuizzes,
  getAnswersRequiringAttentionCounts,
  getUsersAbilities,
  getUserAbilitiesForCourse,
} from "../../services/quizzes"
import usePromise from "react-use-promise"
import { groupBy, Dictionary } from "lodash"
import { Typography, Card, CardContent, Button, Badge } from "@material-ui/core"
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

import { EditableCourseInfo } from "../../components/EditableCourseInfo"

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
  align-items: center;
`

const StyledType = styled(Typography)`
  color: #f44336 !important;
`

const WarningText = styled(Typography)`
  display: flex !important;
  color: #f44336 !important;
`

const Title = styled(Typography)`
  display: flex !important;
`

const CourseTitleAndAbbreviation = styled.section`
  display: flex;
  flex-direction: column;
`

const ShowCoursePage = () => {
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
        <CourseTitleAndAbbreviation>
          <EditableCourseInfo course={course} />
        </CourseTitleAndAbbreviation>
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
                requiringAttention={requirinAttention}
              />
            )
          })}
        </div>
      ))}
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

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const TitleContainer = styled.div`
  display: flex;
  width: 60%;
  margin-right: 0.5px;
`

const ButtonContainer = styled.div`
  display: flex;
  width: 40%;
  justify-content: space-between;
  margin-left: 0.5px;
`

const QuizOfSection = ({ quiz, requirinAttention }: quizProps) => {
  const title = quiz.title
  const types = Array.from(new Set(quiz.items.map(item => item.type)))
  return (
    <Link
      href={{
        pathname: "/quizzes/[quizId]/[page]",
        query: { quizId: `${quiz.id}`, page: "overview" },
      }}
      as={`/quizzes/${quiz.id}/overview`}
    >
      <QuizLink>
        <QuizCard>
          <CardContent>
            <TitleWrapper>
              <TitleContainer>
                <Title color="inherit" variant="body1">
                  {title}
                </Title>
              </TitleContainer>
              <ButtonContainer>
                <Badge
                  color="error"
                  badgeContent={requirinAttention}
                  invisible={requirinAttention === undefined}
                >
                  <Link
                    href={{
                      pathname: "/quizzes/[quizId]/[page]",
                      query: {
                        quizId: `${quiz.id}`,
                        page: "answers-requiring-attention",
                      },
                    }}
                    as={`/quizzes/${quiz.id}/answers-requiring-attention`}
                  >
                    <Button variant="outlined">
                      <Typography>Answers requiring attention</Typography>
                    </Button>
                  </Link>
                </Badge>
                <Link
                  href={{
                    pathname: "/quizzes/[quizId]/[page]",
                    query: {
                      quizId: `${quiz.id}`,
                      page: "edit",
                    },
                  }}
                  as={`/quizzes/${quiz.id}/edit`}
                >
                  <Button variant="outlined">Edit quiz</Button>
                </Link>
              </ButtonContainer>
            </TitleWrapper>
            {types.length > 0 ? (
              <div>
                [{" "}
                {types.map(type => (
                  <StyledType key={type} variant="overline">
                    {type}{" "}
                  </StyledType>
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
