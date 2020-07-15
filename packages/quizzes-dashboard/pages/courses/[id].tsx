import React, { useState } from "react"
import { fetchCourseQuizzes, saveQuiz } from "../../services/quizzes"
import { groupBy, Dictionary } from "lodash"
import { Typography, Card, CardContent, Button } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import DebugDialog from "../../components/DebugDialog"
import Link from "next/link"
import styled from "styled-components"
import useSWR from "swr"
import { withRouter } from "next/router"
import { Quiz } from "../../types/Quiz"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import { NewQuiz } from "../../types/NormalizedQuiz"

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

const ShowCoursePage = ({ router }: any) => {
  const id = router.query.id
  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    { label: "Course" },
  ])
  const { data, error } = useSWR(id, fetchCourseQuizzes)

  if (error) {
    return <div>Something went wrong</div>
  }
  if (!data) {
    return (
      <>
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

  const quizzes = data.quizzes
  const course = data.course
  const byPart = groupBy(quizzes, "part")
  let byPartAndSection: Record<string, Dictionary<Quiz[]>> = {}
  for (let [part, quizzes] of Object.entries(byPart)) {
    byPartAndSection[part] = groupBy(quizzes, "section")
  }
  const createNewQuiz = async () => {
    const newQuiz: NewQuiz = {
      autoConfirm: false,
      autoReject: false,
      awardPointsEvenIfWrong: false,
      body: "",
      courseId: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: null,
      excludedFromScore: true,
      grantPointsPolicy: "grant_whenever_possible",
      items: [],
      open: null,
      part: 0,
      peerReviews: [],
      points: 0,
      section: 0,
      submitMessage: null,
      title: "",
      tries: 1,
      triesLimited: true,
    }
    const res = await saveQuiz(newQuiz)
    if (res !== undefined) {
      quizzes.push(res)
    }
  }
  return (
    <>
      <Button variant="outlined" onClick={() => createNewQuiz()}>
        Add new Quiz
      </Button>
      <Typography variant="h3">Edit {course.title}</Typography>
      {Object.entries(byPartAndSection).map(([part, section]) => (
        <div key={part}>
          <Typography variant="h4">Part {part}</Typography>
          {Object.entries(section).map(([section, quizzes]) => {
            return (
              <SectionOfPart
                key={part + "-" + section}
                section={section}
                quizzes={quizzes}
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
}

const SectionOfPart = ({ section, quizzes }: sectionProps) => {
  return (
    <>
      <Typography variant="h6">Section {section}</Typography>
      {quizzes.map(quiz => {
        return <QuizOfSection key={quiz.id} quiz={quiz} />
      })}
    </>
  )
}

interface quizProps {
  quiz: Quiz
}

const QuizOfSection = ({ quiz }: quizProps) => {
  const title = quiz.title
  return (
    <Link
      href={{ pathname: "/quizzes/[id]/edit", query: { id: `${quiz.id}` } }}
      as={`/quizzes/${quiz.id}/edit`}
    >
      <QuizLink>
        <QuizCard>
          <CardContent>
            <div>
              <Typography display="block" color="inherit" variant="body1">
                {title}
              </Typography>
            </div>
            <div>
              <Typography variant="overline" color="secondary">
                {/* [{quiz.items[0].type}] */}
              </Typography>
            </div>
          </CardContent>
        </QuizCard>
      </QuizLink>
    </Link>
  )
}

export default withRouter(ShowCoursePage)
