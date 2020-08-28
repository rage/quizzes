import React, { useState } from "react"
import { useRouter } from "next/router"
import {
  getAnswersRequiringAttention,
  fetchQuiz,
  fetchCourseById,
} from "../../../services/quizzes"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { AnswerList } from "../../AnswerList"
import usePromise from "react-use-promise"
import { TextField, MenuItem, Switch, Typography } from "@material-ui/core"
import QuizTitle from "../QuizTitleContainer"
import { TabTextLoading, TabTextError, TabText } from "../TabHeaders"
import {
  StyledSkeleton,
  SizeSelectorContainer,
  SizeSelectorField,
  PaginationField,
  SwitchField,
  Paginator,
  OptionsContainer,
} from "./styles"
import { IQueryParams, TAnswersDisplayed } from "./types"

export const RequiringAttention = (props: IQueryParams) => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""

  // pull items from passed in query data
  let {
    queryParams: {
      pageNo: paramPage,
      size: paramSize,
      expandAll: paramExpand,
      sort: paramSort,
    },
  } = props

  // normalise data format
  paramSize = Number(paramSize) as TAnswersDisplayed
  paramPage = Number(paramPage)
  paramExpand = Boolean(paramExpand)

  const [currentPage, setCurrentPage] = useState(paramPage || 1)
  const [answersDisplayed, setAnswersDisplayed] = useState(10)
  const [expandAll, setExpandAll] = useState(false)
  const [sortOrder, setSortOrder] = useState("desc")

  const [answers, error] = usePromise(
    () =>
      getAnswersRequiringAttention(
        quizId,
        currentPage,
        answersDisplayed,
        sortOrder,
      ),
    [currentPage, answersDisplayed, sortOrder],
  )
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
      label: "Quiz answers requiring attention",
    },
  ])

  if (!answers || !quiz || !course) {
    return (
      <>
        <TabTextLoading />
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

  if (error || quizError || courseError) {
    return (
      <>
        <TabTextError />
        <div>Error while fetching answers.</div>
      </>
    )
  }

  const handleChange = (event: any, nextPage?: number) => {
    const URL_HREF = `/quizzes/[quizId]/[page]`
    const pathname = `/quizzes/${quizId}/all-answers/`

    let query = {
      pageNo: currentPage,
      size: answersDisplayed,
      expandAll: expandAll,
      sort: sortOrder,
    }

    if (nextPage) {
      query = { ...query, pageNo: nextPage }
      setCurrentPage(nextPage)
      route.push(URL_HREF, { pathname, query }, { shallow: true })
      return
    }

    switch (event.target.name) {
      case "size-selector":
        setAnswersDisplayed(Number(event.target.value) as TAnswersDisplayed)
        query = { ...query, size: event.target.value }
        break
      case "expand-field":
        setExpandAll(event.target.checked)
        query = { ...query, expandAll: event.target.checked }
        break
      case "order-field":
        setSortOrder(event.target.value)
        query = { ...query, sort: event.target.value }
        break
      default:
        break
    }

    // in all cases, push all the query params
    route.push(URL_HREF, { pathname, query }, { shallow: true })
  }

  return (
    <>
      <TabText text="Answers requiring attention" />
      {answers.results.length === 0 ? (
        <>
          <QuizTitle quiz={quiz} course={course} />
          <Typography variant="h3">No answers requiring attention</Typography>
        </>
      ) : (
        <>
          <QuizTitle quiz={quiz} course={course} />
          <SizeSelectorContainer>
            <SizeSelectorField
              name="size-selector"
              value={answersDisplayed}
              size="medium"
              label="Answers"
              variant="outlined"
              select
              onChange={event => handleChange(event)}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </SizeSelectorField>
          </SizeSelectorContainer>
          <PaginationField>
            <Paginator
              siblingCount={2}
              boundaryCount={2}
              count={Math.ceil(answers.total / answersDisplayed)}
              size="large"
              color="primary"
              showFirstButton
              showLastButton
              page={currentPage}
              onChange={(event, nextPage) => handleChange(event, nextPage)}
            />
          </PaginationField>
          <OptionsContainer>
            <SwitchField>
              <Typography>Expand all</Typography>
              <Switch
                name="expand-field"
                checked={expandAll}
                onChange={event => {
                  handleChange(event)
                }}
              />
            </SwitchField>
            <TextField
              name="order-field"
              label="Sort order"
              variant="outlined"
              select
              helperText="Sorts answers by date they've been submitted"
              value={sortOrder}
              onChange={event => handleChange(event)}
            >
              <MenuItem value="desc">Latest first</MenuItem>
              <MenuItem value="asc">Oldest first</MenuItem>
            </TextField>
          </OptionsContainer>
          <AnswerList
            data={answers.results}
            error={error}
            expandAll={expandAll}
          />
          <PaginationField>
            <Paginator
              siblingCount={2}
              boundaryCount={2}
              count={Math.ceil(answers.total / answersDisplayed)}
              size="large"
              color="primary"
              showFirstButton
              showLastButton
              page={currentPage}
              onChange={(event, nextPage) => handleChange(event, nextPage)}
            />
          </PaginationField>
        </>
      )}
    </>
  )
}

export default RequiringAttention
