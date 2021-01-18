import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { MenuItem, Switch, Typography } from "@material-ui/core"
import QuizTitle from "../QuizTitleContainer"
import { TabText } from "../TabHeaders"
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
  setBulkSelectedIds,
  setExpandAll,
  setHandledAnswers,
  useAnswerListState,
} from "../../../contexts/AnswerListContext"
import AnswerListOptions from "../../Answer/AnswerListOptions"
import { useRequiringAttention } from "../../../hooks/useAnswersRequiringAttention"
import { useSearchResultsRequiringAttention } from "../../../hooks/useSearchResults"
import DisplayAnswers from "../../Answer/DisplayAnswers"

export const RequiringAttention = ({ quiz, course }: IQuizTabProps) => {
  const [{ expandAll }, dispatch] = useAnswerListState()

  const route = useRouter()
  const { pageNo, sort, answers } = route.query
  const quizId = route.query.quizId?.toString() ?? ""

  const pathname = `/quizzes/${quizId}/answers-requiring-attention/`

  const [currentPage, setCurrentPage] = useState(Number(pageNo) || 1)
  const [sortOrder, setSortOrder] = useState((sort as string) || "desc")
  const [answersDisplayed, setAnswersDisplayed] = useState(
    Number(answers) || 10,
  )

  const [searchQuery, setSearchQuery] = useState("")

  const {
    answersRequiringAttention,
    answersRequiringAttentionLoading,
    answersRequiringAttentionError,
  } = useRequiringAttention(
    quizId,
    currentPage,
    answersDisplayed,
    sortOrder,
    "answers-requiring-attention",
  )

  const {
    searchResults,
    searchResultsLoading,
    searchResultsError,
  } = useSearchResultsRequiringAttention(
    quizId,
    answersDisplayed,
    sortOrder,
    searchQuery,
    "search-answers-requiring-attention",
  )

  const [availableAnswers, setAvailableAnswers] = useState<{
    results: Answer[]
    total: number
  }>({
    results: [],
    total: 0,
  })

  useEffect(() => {
    dispatch(setBulkSelectedIds([]))
    dispatch(setHandledAnswers([]))
    if (searchResults) {
      setAvailableAnswers(searchResults)
    } else if (answersRequiringAttention) {
      setAvailableAnswers(answersRequiringAttention)
    }
  }, [answers])

  const [queryToPush, setQueryToPush] = useState({})

  useBreadcrumbs([
    { label: "Courses", as: "/" },
    {
      label: `${course ? course.title : ""}`,
      as: `/courses/${quiz?.courseId}/listing`,
    },
    {
      label: `${quiz ? quiz.title : ""}`,
    },
  ])

  const handlePageChange = (nextPage: number) => {
    setQueryToPush({ ...queryToPush, pageNo: nextPage })
    setCurrentPage(nextPage)
    let query = { ...queryToPush, pageNo: nextPage }
    route.push(pathname, { pathname, query }, { shallow: true })
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
    route.push(pathname, { pathname, query }, { shallow: true })
  }

  const handleTextSearch = async (searchQuery: string) => {
    setSearchQuery(searchQuery)
  }

  const answersAreAvailable = availableAnswers.results.length > 0
  const answersAreBeingFetched =
    searchResultsLoading || answersRequiringAttentionLoading
  const errorFetchingAnswers =
    answersRequiringAttentionError || searchResultsError
  const noResults = !answersAreBeingFetched && !answersAreAvailable

  return (
    <>
      <TabText text="Answers requiring attention" />

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
        handleTextSearch={handleTextSearch}
        searchResultCount={searchResults?.total || 0}
      />
      <DisplayAnswers
        answersAreBeingFetched={answersAreBeingFetched}
        answersAreAvailable={answersAreAvailable}
        errorFetchingAnswers={errorFetchingAnswers}
        noResults={noResults}
      >
        <AnswerListWrapper
          order={sortOrder}
          quizId={quizId}
          size={answersDisplayed}
          handlePageChange={handlePageChange}
          page={currentPage}
          answers={availableAnswers}
        />
      </DisplayAnswers>
    </>
  )
}

export default RequiringAttention
