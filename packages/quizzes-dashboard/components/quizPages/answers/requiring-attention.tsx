import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  getAnswersRequiringAttention,
  getAnswersRequiringAttentionMatchingQuery,
} from "../../../services/quizzes"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import usePromise from "react-use-promise"
import { MenuItem, Switch, Typography } from "@material-ui/core"
import QuizTitle from "../QuizTitleContainer"
import { TabTextError, TabText } from "../TabHeaders"
import {
  SizeSelectorField,
  SwitchField,
  OptionsContainer,
  SortOrderField,
} from "./styles"
import { IQuizTabProps, TAnswersDisplayed } from "./types"
import AnswerListWrapper from "../../Answer/AnswerListWrapper"
import { Answer } from "../../../types/Answer"
import {
  setExpandAll,
  useAnswerListState,
} from "../../../contexts/AnswerListContext"
import AnswerListOptions from "../../Answer/AnswerListOptions"

export const RequiringAttention = ({ quiz, course }: IQuizTabProps) => {
  const [{ expandAll }, dispatch] = useAnswerListState()

  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""

  const URL_HREF = `/quizzes/[quizId]/[...page]`
  const pathname = `/quizzes/${quizId}/answers-requiring-attention/`

  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState("desc")
  const [answersDisplayed, setAnswersDisplayed] = useState(10)

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

  const [queryToPush, setQueryToPush] = useState({})

  useEffect(() => {
    const { pageNo, sort, answers, expandAll } = route.query
    let initialQuery: any = {}

    if (pageNo) {
      setCurrentPage(Number(pageNo))
      initialQuery.pageNo = pageNo
    }
    if (answers) {
      setAnswersDisplayed(Number(answers))
      initialQuery.answers = answers
    }
    if (expandAll) {
      dispatch(setExpandAll(true))
      initialQuery.expandAll = expandAll
    }
    if (sort) {
      setSortOrder(sort as string)
      initialQuery.sort = sort
    }

    setQueryToPush(initialQuery)
  }, [])

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

  if (answersError) {
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

  const handleFieldChange = (
    event: React.ChangeEvent<any>,
    fieldType?: string,
  ) => {
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
        updatedQueryParams = {
          ...queryToPush,
          expandAll: event.target.checked,
        }
        setQueryToPush(updatedQueryParams)
        dispatch(setExpandAll(event.target.checked))
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
      console.log(err)
    } finally {
      setFetchingAnswers(false)
    }
  }

  const availableAnswers = searchResults
    ? searchResults
    : answers
    ? answers
    : { results: [], total: 0 }

  return (
    <>
      <TabText text="Answers requiring attention" />
      {answers?.results.length === 0 ? (
        <>
          <QuizTitle quiz={quiz} />
          <Typography variant="h3">No answers requiring attention</Typography>
        </>
      ) : (
        <>
          <QuizTitle quiz={quiz} />
          <OptionsContainer>
            <SwitchField>
              <Typography>Expand all</Typography>
              <Switch
                name="expand-field"
                checked={route.query.expandAll ? true : expandAll}
                onChange={event => {
                  handleFieldChange(event, "expand")
                }}
              />
            </SwitchField>
            <SizeSelectorField
              value={answersDisplayed}
              size="medium"
              label="Answers"
              variant="outlined"
              select
              onChange={event => handleFieldChange(event, "pages")}
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
              onChange={event => handleFieldChange(event, "order")}
            >
              <MenuItem value="desc">Latest first</MenuItem>
              <MenuItem value="asc">Oldest first</MenuItem>
            </SortOrderField>
          </OptionsContainer>
          <AnswerListOptions
            answers={availableAnswers}
            handleTextSearch={handleSubmit}
          />
          <AnswerListWrapper
            order={sortOrder}
            quizId={quizId}
            size={answersDisplayed}
            handlePageChange={handlePageChange}
            page={currentPage}
            answersError={answersError}
            fetchingAnswers={fetchingAnswers}
            answers={availableAnswers}
          />
        </>
      )}
    </>
  )
}

export default RequiringAttention
