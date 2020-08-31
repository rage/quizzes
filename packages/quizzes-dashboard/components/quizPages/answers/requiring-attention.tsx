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
import styled from "styled-components"
import { Pagination, Skeleton } from "@material-ui/lab"
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
  SortOrderField,
} from "./styles"
import { IQueryParams, TAnswersDisplayed, TSortOptions } from "./types"

export const RequiringAttention = (props: IQueryParams) => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""

  const URL_HREF = `/quizzes/[quizId]/[page]`
  const pathname = `/quizzes/${quizId}/all-answers/`

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

  const [currentPage, setCurrentPage] = useState<number>(paramPage || 1)
  const [sortOrder, setSortOrder] = useState<TSortOptions>(paramSort || "desc")
  const [expandAll, setExpandAll] = useState<boolean>(paramExpand || false)
  const [answersDisplayed, setAnswersDisplayed] = useState<TAnswersDisplayed>(
    paramSize || 10,
  )

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
      label: `${course ? course.title : ""}`,
      as: `/courses/${quiz?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: `${quiz ? quiz.title : ""}`,
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

  const handlePageChange = (nextPage: number) => {
    let query = {
      pageNo: currentPage,
      size: answersDisplayed,
      expandAll: expandAll,
      sort: sortOrder,
    }
    query = { ...query, pageNo: nextPage }
    setCurrentPage(nextPage)
    route.push(URL_HREF, { pathname, query }, { shallow: true })
  }

  const handleChange = (event: any, fieldType?: string, nextPage?: number) => {
    console.log(route)
    let query = {
      pageNo: currentPage,
      size: answersDisplayed,
      expandAll: expandAll,
      sort: sortOrder,
    }

    switch (fieldType) {
      case "pages":
        setAnswersDisplayed(Number(event.target.value) as TAnswersDisplayed)
        query = { ...query, size: event.target.value }
        break
      case "expand":
        setExpandAll(event.target.checked)
        query = { ...query, expandAll: event.target.checked }
        break
      case "order":
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
              onChange={(event, nextPage) => handlePageChange(nextPage)}
            />
          </PaginationField>
          <OptionsContainer>
            <SwitchField>
              <Typography>Expand all</Typography>
              <Switch
                name="expand-field"
                checked={expandAll}
                onChange={event => {
                  handleChange(event, "expand")
                }}
              />
            </SwitchField>
            <SizeSelectorField
              value={answersDisplayed}
              size="medium"
              label="Answers"
              variant="outlined"
              select
              onChange={event => handleChange(event, "pages")}
              helperText="How many answers are shown per page"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </SizeSelectorField>
            <SortOrderField
              label="Sort order"
              variant="outlined"
              select
              helperText="Sorts answers by date they've been submitted"
              value={sortOrder}
              onChange={event => handleChange(event, "order")}
            >
              <MenuItem value="desc">Latest first</MenuItem>
              <MenuItem value="asc">Oldest first</MenuItem>
            </SortOrderField>
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
              onChange={(event, nextPage) => handlePageChange(nextPage)}
            />
          </PaginationField>
        </>
      )}
    </>
  )
}

export default RequiringAttention
