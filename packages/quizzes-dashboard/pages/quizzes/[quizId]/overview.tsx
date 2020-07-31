import React from "react"
import usePromise from "react-use-promise"
import { fetchQuiz, fetchCourseById } from "../../../services/quizzes"
import { Skeleton } from "@material-ui/lab"
import styled from "styled-components"
import { Typography, Card, Button } from "@material-ui/core"
import Link from "next/link"
import { useRouter } from "next/router"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { checkStore } from "../../../services/tmcApi"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const LinkWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between !important;
  padding: 1rem;
`

const LinkContainer = styled.div`
  display: flex;
  width: 30%;
  justify-content: center;
`

const TitleContainer = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-around;
  width: 100%;
`

const DescriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  white-space: pre-line;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
`

const StyledCard = styled(Card)`
  display: flex;
  justify-content: space-around !important;
  flex-wrap: wrap !important;
  width: 100%;
  margin-top: 1rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 7px 0px,
    rgba(0, 0, 0, 0.15) 0px 3px 6px -2px, rgba(0, 0, 0, 0.25) 0px 1px 10px 0px !important;
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const CourseName = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`
const SubmitButton = styled(Button)`
  display: flex !important;
  background: #00e676 !important;
`

const StyledForm = styled.form`
  display: flex !important;
  justify-content: center;
  width: 30% !important;
`
export const OverView = () => {
  const router = useRouter()
  const quizId = router.query.quizId?.toString() ?? ""
  const [quiz, quizError] = usePromise(() => fetchQuiz(quizId), [])
  const [course, courseError] = usePromise(
    () => fetchCourseById(quiz?.courseId ?? ""),
    [quiz],
  )

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quiz?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: "Quiz Overview",
    },
  ])

  const userInfo = checkStore()

  let HOST = "http://localhost:3003"
  if (process.env.NODE_ENV === "production") {
    HOST = "https://quizzes2.mooc.fi"
  }

  if (!quiz || !course) {
    return (
      <>
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
      </>
    )
  }

  if (quizError || courseError) {
    return <>Something went wrong while fetching quiz</>
  }

  return (
    <>
      <LinkWrapper>
        <LinkContainer>
          <Link href="/quizzes/[quizId]/edit" as={`/quizzes/${quiz.id}/edit`}>
            <a>
              <Typography>Edit quiz</Typography>
            </a>
          </Link>
        </LinkContainer>
        <LinkContainer>
          <Link
            href="/quizzes/[quizId]/answers/all"
            as={`/quizzes/${quiz.id}/answers/all`}
          >
            <a>
              <Typography>All answers</Typography>
            </a>
          </Link>
        </LinkContainer>
        <LinkContainer>
          <Link
            href="/quizzes/[quizId]/answers/requiring-attention"
            as={`/quizzes/${quiz.id}/answers/requiring-attention`}
          >
            <a>
              <Typography>Answers requiring attention</Typography>
            </a>
          </Link>
        </LinkContainer>
      </LinkWrapper>
      <HeaderContainer>
        <CourseName>
          <Typography>{course.title}</Typography>
        </CourseName>
        <Typography>
          Part {quiz.part}, Section {quiz.section}
        </Typography>
      </HeaderContainer>
      <StyledCard>
        <TitleContainer>
          <Typography variant="h3">{quiz.title}</Typography>
        </TitleContainer>
        <DescriptionContainer>
          <Typography>{quiz.body}</Typography>
        </DescriptionContainer>
      </StyledCard>
      <FormContainer>
        <StyledForm
          method="post"
          action={
            HOST +
            "/api/v2/dashboard/quizzes/fb3e403f-300a-5698-a26f-6498f7d2a3d5/download-quiz-info"
          }
        >
          <input
            value={userInfo?.accessToken}
            type="hidden"
            name="token"
            id="token"
          />
          <SubmitButton type="submit" variant="outlined">
            Download quiz info
          </SubmitButton>
        </StyledForm>
        <StyledForm
          method="post"
          action={
            HOST +
            "/api/v2/dashboard/quizzes/fb3e403f-300a-5698-a26f-6498f7d2a3d5/download-peerreview-info"
          }
        >
          <input
            value={userInfo?.accessToken}
            type="hidden"
            name="token"
            id="token"
          />
          <SubmitButton type="submit" variant="outlined">
            Download peerreview info
          </SubmitButton>
        </StyledForm>
        <StyledForm
          method="post"
          action={
            HOST +
            "/api/v2/dashboard/quizzes/fb3e403f-300a-5698-a26f-6498f7d2a3d5/download-answer-info"
          }
        >
          <input
            value={userInfo?.accessToken}
            type="hidden"
            name="token"
            id="token"
          />
          <SubmitButton type="submit" variant="outlined">
            Download answer info
          </SubmitButton>
        </StyledForm>
      </FormContainer>
    </>
  )
}

export default OverView
