import React, { useState } from "react"
import { useRouter } from "next/router"
import {
  getAnswersRequiringAttention,
  fetchQuiz,
  fetchCourseById,
  getAnswersRequiringAttentionMatchingQuery,
} from "../../../services/quizzes"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import usePromise from "react-use-promise"
import { MenuItem, Switch, Typography } from "@material-ui/core"
import QuizTitle from "../QuizTitleContainer"
import { TabTextLoading, TabTextError, TabText } from "../TabHeaders"
import {
  SizeSelectorField,
  SwitchField,
  OptionsContainer,
  SortOrderField,
} from "./styles"
import { TAnswersDisplayed, TSortOptions } from "./types"
import SkeletonLoader from "../../Shared/SkeletonLoader"
import AnswerSearchForm from "../../AnswerSearchForm"
import AnswerListWrapper from "../../Answer/AnswerListWrapper"
import { Answer } from "../../../types/Answer"

export const RequiringAttention = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""

  const URL_HREF = `/quizzes/[quizId]/[...page]`
  const pathname = `/quizzes/${quizId}/answers-requiring-attention/`

  const paramSize = Number(route.query.answers) as TAnswersDisplayed
  const paramPage = Number(route.query.pageNo)
  let paramSort: TSortOptions | null = null
  if (route.query.sort) {
    paramSort = route.query.sort as TSortOptions
  }
  const paramExpand = route.query.expandAll === "true" ? true : false

  const [currentPage, setCurrentPage] = useState<number>(paramPage || 1)
  const [sortOrder, setSortOrder] = useState<TSortOptions>(paramSort || "desc")
  const [expandAll, setExpandAll] = useState<boolean>(paramExpand || false)
  const [answersDisplayed, setAnswersDisplayed] = useState<TAnswersDisplayed>(
    paramSize || 10,
  )

  const [answers, answersError] = usePromise(
    () =>
      getAnswersRequiringAttention(
        quizId,
        currentPage,
        answersDisplayed,
        sortOrder,
      ),
    [currentPage, answersDisplayed, sortOrder],
  )

  const [searchResults, setSearchResults] = useState<
    | {
        results: Answer[]
        total: number
      }
    | undefined
    | null
  >(null)
  const [fetchingAnswers, setFetchingAnswers] = useState(false)

  const [quiz, quizError] = usePromise(() => fetchQuiz(quizId), [])
  const [course, courseError] = usePromise(
    () => fetchCourseById(quiz?.courseId ?? ""),
    [quiz],
  )

  const [queryToPush, setQueryToPush] = useState({})

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: `${course ? course.title : ""}`,
      as: `/courses/${quiz?.courseId}/listing`,
      href: "/courses/[courseId]/[...page]",
    },
    {
      label: `${quiz ? quiz.title : ""}`,
    },
  ])

  // if (!quiz) {
  //   return (
  //     <>
  //       <TabTextLoading />
  //       <SkeletonLoader height={250} skeletonCount={15} />
  //     </>
  //   )
  // }

  if (answersError || quizError || courseError) {
    return (
      <>
        <TabTextError />
        <div>Error while fetching answers.</div>
      </>
    )
  }

  const handlePageChange = (nextPage: number) => {
    setQueryToPush({ ...queryToPush, pageNo: nextPage })
    setCurrentPage(nextPage)
    let query = { ...queryToPush, pageNo: nextPage }
    route.push(URL_HREF, { pathname, query }, { shallow: true })
  }

  const handleChange = (event: React.ChangeEvent<any>, fieldType?: string) => {
    let query = null
    let updatedQueryParams = null

    switch (fieldType) {
      case "pages":
        updatedQueryParams = {
          ...queryToPush,
          answers: event.target.value,
        }
        setQueryToPush(updatedQueryParams)
        setAnswersDisplayed(Number(event.target.value) as TAnswersDisplayed)
        query = updatedQueryParams
        break
      case "expand":
        updatedQueryParams = { ...queryToPush, expandAll: event.target.checked }
        setQueryToPush(updatedQueryParams)
        setExpandAll(event.target.checked)
        query = updatedQueryParams
        break
      case "order":
        updatedQueryParams = { ...queryToPush, sort: event.target.value }
        setQueryToPush(updatedQueryParams)
        setSortOrder(event.target.value)
        query = updatedQueryParams
        break
      default:
        break
    }

    // in all cases, push all the query params
    route.push(URL_HREF, { pathname, query }, { shallow: true })
  }

  const handleSubmit = async (searchQuery: string) => {
    try {
      setFetchingAnswers(true)
      if (!searchQuery) {
        setSearchResults(null)
      } else {
        const response = await getAnswersRequiringAttentionMatchingQuery(
          quizId,
          currentPage,
          answersDisplayed,
          sortOrder,
          searchQuery,
        )
        setSearchResults(response)
      }
    } catch (err) {
      // setAnswersError(err)
    } finally {
      setFetchingAnswers(false)
    }
  }

  return (
    <>
      <TabText text="Answers requiring attention" />
      {answers?.results.length === 0 && quiz ? (
        <>
          <QuizTitle quiz={quiz} />
          <Typography variant="h3">No answers requiring attention</Typography>
        </>
      ) : (
        <>
          {quiz && <QuizTitle quiz={quiz} />}
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
          <AnswerSearchForm handleSubmit={handleSubmit} />
          <AnswerListWrapper
            expandAll={expandAll}
            order={sortOrder}
            quizId={quizId}
            size={answersDisplayed}
            handlePageChange={handlePageChange}
            page={currentPage}
            answersError={answersError}
            fetchingAnswers={fetchingAnswers}
            answers={searchResults ? searchResults : answers}
          />
        </>
      )}
    </>
  )
}

export default RequiringAttention
