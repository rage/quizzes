import React, { useState, useEffect } from "react"
import _ from "lodash"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { MenuItem, Switch, Typography, Chip } from "@material-ui/core"
import styled from "styled-components"
import QuizTitle from "../QuizTitleContainer"
import { TabText } from "../TabHeaders"
import {
  SizeSelectorField,
  OptionsContainer,
  SwitchField,
  SortOrderField,
  FilterParamsField,
} from "./styles"
import { ChipProps, IQuizTabProps, TAnswersDisplayed } from "./types"
import { StyledTitle } from "../../Answer/CardContent/Peerreviews/Review"
import AnswerListWrapper from "../../Answer/AnswerListWrapper"
import { Answer } from "../../../types/Answer"
import {
  useAnswerListState,
  setExpandAll,
  setBulkSelectedIds,
  setHandledAnswers,
} from "../../../contexts/AnswerListContext"
import AnswerListOptions from "../../Answer/AnswerListOptions"
import { useAllAnswers } from "../../../hooks/useAllAnswers"
import { useSearchResultsAllAnswers } from "../../../hooks/useSearchResults"
import DisplayAnswers from "../../Answer/DisplayAnswers"

const StyledChip = styled(Chip)<ChipProps>`
  display: flex !important;
  background: ${props => {
    if (props.checked) {
      return "linear-gradient(rgba(0, 0, 0, 0.2), rgba(63, 81, 181, 0.3)) !important"
    }
  }};
  margin-left: 0.5rem !important;
  margin-right: 0.5rem !important;
  margin-bottom: 0.5rem !important;
`

export const AllAnswers = ({ quiz, course }: IQuizTabProps) => {
  // all answers from context
  const [{ expandAll }, dispatch] = useAnswerListState()

  const route = useRouter()
  const { pageNo, sort, answers, filters } = route.query
  const filtersAsStringArray = filters?.toString().split(",")

  const quizId = quiz?.id

  const pathname = `/quizzes/${quizId}/all-answers/`

  const [currentPage, setCurrentPage] = useState(Number(pageNo) || 1)
  const [sortOrder, setSortOrder] = useState((sort as string) || "desc")
  const [answersDisplayed, setAnswersDisplayed] = useState(
    Number(answers) || 10,
  )
  const [filterParameters, setFilterParameters] = useState<string[]>(
    filtersAsStringArray || [],
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [queryToPush, setQueryToPush] = useState({})
  useBreadcrumbs([
    {
      label: "Courses",
      as: "/",
    },
    {
      label: `${course ? course.title : ""}`,
      as: `/courses/${quiz?.courseId}/listing`,
    },
    {
      label: `${quiz ? quiz.title : ""}`,
    },
  ])

  const { allAnswers, allAnswersLoading, allAnswersError } = useAllAnswers(
    quizId,
    currentPage,
    answersDisplayed,
    sortOrder,
    filterParameters,
    "all-answers",
  )

  const {
    searchResults,
    searchResultsLoading,
    searchResultsError,
  } = useSearchResultsAllAnswers(
    quizId,
    answersDisplayed,
    sortOrder,
    searchQuery,
    filterParameters,
    "search-all-answers",
  )

  const [availableAnswers, setAvailableAnswers] = useState<{
    results: Answer[]
    total: number
  }>({
    results: [],
    total: 0,
  })

  const isIncludedInFilter = (param: string) => {
    if (!route.query.filters) {
      return false
    }
    return route.query.filters?.includes(param)
  }

  const states: {
    [state: string]: {
      checked: boolean
    }
  } = {
    "manual-review": {
      checked: isIncludedInFilter("manual-review"),
    },
    rejected: {
      checked: isIncludedInFilter("rejected"),
    },
    "manual-review-once-given-and-received-enough": {
      checked: isIncludedInFilter(
        "manual-review-once-given-and-received-enough",
      ),
    },
    draft: {
      checked: isIncludedInFilter("draft"),
    },
    "given-enough": {
      checked: isIncludedInFilter("given-enough"),
    },
    confirmed: {
      checked: isIncludedInFilter("confirmed"),
    },
    "given-more-than-enough": {
      checked: isIncludedInFilter("given-more-than-enough"),
    },
    deprecated: {
      checked: isIncludedInFilter("deprecated"),
    },
    "enough-received-but-not-given": {
      checked: isIncludedInFilter("enough-received-but-not-given"),
    },
    submitted: {
      checked: isIncludedInFilter("submitted"),
    },
    "manual-review-once-given-enough": {
      checked: isIncludedInFilter("manual-review-once-given-enough"),
    },
    spam: {
      checked: isIncludedInFilter("spam"),
    },
  }

  const [chipStates, setChipStates] = useState(states)

  useEffect(() => {
    console.log("first use effect ran")
    dispatch(setBulkSelectedIds([]))
    dispatch(setHandledAnswers([]))
    if (searchResults) {
      setAvailableAnswers(searchResults)
    } else if (allAnswers) {
      setAvailableAnswers(allAnswers)
    }

    if (filtersAsStringArray) {
      setFilterParameters(filtersAsStringArray)
    }
  }, [allAnswers, searchResults])

  const handleTextSearch = async (searchQuery: string) => {
    setSearchQuery(searchQuery)
  }

  /**
   *  handled separately since
   * @param nextPage page being paginated to
   */
  const handlePageChange = (nextPage: number) => {
    setQueryToPush({
      ...queryToPush,
      pageNo: nextPage,
    })
    setCurrentPage(nextPage)
    let query = {
      ...queryToPush,
      pageNo: nextPage,
    }
    route.push(
      pathname,
      {
        pathname,
        query,
      },
      {
        shallow: true,
      },
    )
  }

  /**
   *
   * @param event
   * @param fieldType - the field being interacted with
   */
  const handleFieldChange = (
    event: React.ChangeEvent<any>,
    fieldType?: string,
  ) => {
    let query = null
    let updatedQueryParams = queryToPush

    switch (fieldType) {
      case "pages":
        updatedQueryParams = {
          ...updatedQueryParams,
          answers: event.target.value,
        }
        setQueryToPush(updatedQueryParams)
        setAnswersDisplayed(Number(event.target.value) as TAnswersDisplayed)
        query = updatedQueryParams
        break
      case "expand":
        updatedQueryParams = {
          ...updatedQueryParams,
          expandAll: event.target.checked,
        }
        setQueryToPush(updatedQueryParams)
        dispatch(setExpandAll(!expandAll))
        query = updatedQueryParams
        break
      case "order":
        updatedQueryParams = {
          ...updatedQueryParams,
          sort: event.target.value,
        }
        setQueryToPush(updatedQueryParams)
        setSortOrder(event.target.value)
        query = updatedQueryParams
        break
      case "filter":
        updatedQueryParams = {
          ...updatedQueryParams,
          filters: event.target.value,
        }
        setQueryToPush(updatedQueryParams)
        query = updatedQueryParams
        break
      default:
        break
    }

    setQueryToPush(updatedQueryParams)
    route.push(
      pathname,
      {
        pathname,
        query,
      },
      {
        shallow: true,
      },
    )
  }

  /**
   * filters pushed as a comma-separated list
   * @param filters
   */
  const handleFilterChanges = (filters: string | string[]) => {
    filters = filters.toString()
    // if removing last filter
    if (filters === "") {
      let updatedQueryParams: any = {
        ...queryToPush,
      }
      // remove filter from query params so it doesn't display and empty filter query
      if (updatedQueryParams.filters) {
        delete updatedQueryParams.filters
      }
      setQueryToPush(updatedQueryParams)
      let query = updatedQueryParams
      route.push(
        pathname,
        {
          pathname,
          query,
        },
        {
          shallow: true,
        },
      )
      return
    }

    let updatedQueryParams = {
      ...queryToPush,
      filters: filters,
    }
    setQueryToPush(updatedQueryParams)
    let query = updatedQueryParams
    route.push(
      pathname,
      {
        pathname,
        query,
      },
      {
        shallow: true,
      },
    )
  }

  const answersAreAvailable = availableAnswers.results.length > 0
  const answersAreBeingFetched = searchResultsLoading || allAnswersLoading

  const errorFetchingAnswers = allAnswersError || searchResultsError
  const noResults = !answersAreBeingFetched && !answersAreAvailable

  return (
    <>
      <TabText text="All answers" />
      <QuizTitle quiz={quiz} />
      <OptionsContainer>
        <SwitchField>
          <Typography>Expand all</Typography>
          <Switch
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
          helperText="How many answers are shown per page"
          select
          onChange={event => {
            handleFieldChange(event, "pages")
          }}
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
      <StyledTitle variant="subtitle1">Status filters</StyledTitle>
      <FilterParamsField>
        {Object.keys(chipStates).map(state => {
          return (
            <StyledChip
              defaultValue={state}
              key={state}
              label={state}
              variant="outlined"
              checked={chipStates[state].checked}
              onClick={() => {
                const newStates = _.clone(chipStates)
                newStates[state].checked = !newStates[state].checked
                setChipStates(newStates)
                let paramsToSet = _.clone(filterParameters)
                if (chipStates[state].checked) {
                  paramsToSet = paramsToSet.concat(state)
                  setFilterParameters(paramsToSet)
                } else {
                  paramsToSet = paramsToSet.filter(param => param !== state)
                  setFilterParameters(paramsToSet)
                }
                // update url
                handleFilterChanges(paramsToSet)
              }}
            />
          )
        })}
      </FilterParamsField>
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

export default AllAnswers
