import React, { useState, useEffect } from "react"
import _ from "lodash"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { getAllAnswersMatchingQuery } from "../../../services/quizzes"
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
  setAllAnswers,
} from "../../../contexts/AnswerListContext"
import AnswerListOptions from "../../Answer/AnswerListOptions"
import { useAllAnswers } from "../../../hooks/useAllAnswers"

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
  const [
    { expandAll, allAnswers: allAnswersInContext },
    dispatch,
  ] = useAnswerListState()

  const route = useRouter()
  const quizId = quiz?.id

  const URL_HREF = `/quizzes/[quizId]/[...page]`
  const pathname = `/quizzes/${quizId}/all-answers/`

  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState("desc")
  const [answersDisplayed, setAnswersDisplayed] = useState(10)
  const [filterParameters, setFilterParameters] = useState<string[]>([])

  const { allAnswers, allAnswersError: answersError } = useAllAnswers(
    quizId,
    currentPage,
    answersDisplayed,
    sortOrder,
    filterParameters,
    "all-answers",
  )

  useEffect(() => {
    if (allAnswers) {
      dispatch(setAllAnswers(allAnswers))
    }
  }, [allAnswers])

  const [searchResults, setSearchResults] = useState<
    | {
        results: Answer[]
        total: number
      }
    | undefined
    | null
  >(null)

  const [fetchingAnswers, setFetchingAnswers] = useState(false)

  const handleTextSearch = async (searchQuery: string) => {
    try {
      setFetchingAnswers(true)
      if (!searchQuery) {
        setSearchResults(null)
      } else {
        const response = await getAllAnswersMatchingQuery(
          quizId,
          currentPage,
          answersDisplayed,
          sortOrder,
          filterParameters,
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

  const isIncludedInFilter = (param: string) => {
    if (!route.query.filters) {
      return false
    }
    return route.query.filters?.includes(param)
  }

  const states: { [state: string]: { checked: boolean } } = {
    "manual-review": { checked: isIncludedInFilter("manual-review") },
    rejected: { checked: isIncludedInFilter("rejected") },
    "manual-review-once-given-and-received-enough": {
      checked: isIncludedInFilter(
        "manual-review-once-given-and-received-enough",
      ),
    },
    draft: { checked: isIncludedInFilter("draft") },
    "given-enough": { checked: isIncludedInFilter("given-enough") },
    confirmed: { checked: isIncludedInFilter("confirmed") },
    "given-more-than-enough": {
      checked: isIncludedInFilter("given-more-than-enough"),
    },
    deprecated: { checked: isIncludedInFilter("deprecated") },
    "enough-received-but-not-given": {
      checked: isIncludedInFilter("enough-received-but-not-given"),
    },
    submitted: { checked: isIncludedInFilter("submitted") },
    "manual-review-once-given-enough": {
      checked: isIncludedInFilter("manual-review-once-given-enough"),
    },
    spam: { checked: isIncludedInFilter("spam") },
  }

  const [chipStates, setChipStates] = useState(states)

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

  const [queryToPush, setQueryToPush] = useState({})

  const { pageNo, sort, answers, filters } = route.query

  // this needs to be run so that if the page with query params is loaded in
  // another window, the params can be updated without clearing the rest first
  useEffect(() => {
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
    if (filters) {
      let filtersAsStringArray: string[] = filters.toString().split(",")
      setFilterParameters(filtersAsStringArray)
      initialQuery.filters = filtersAsStringArray
    }
    setQueryToPush(initialQuery)
  }, [])

  /**
   *  handled separately since
   * @param nextPage page being paginated to
   */
  const handlePageChange = (nextPage: number) => {
    setQueryToPush({ ...queryToPush, pageNo: nextPage })
    setCurrentPage(nextPage)
    let query = { ...queryToPush, pageNo: nextPage }
    route.push(URL_HREF, { pathname, query }, { shallow: true })
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
        updatedQueryParams = { ...updatedQueryParams, sort: event.target.value }
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
    route.push(URL_HREF, { pathname, query }, { shallow: true })
  }

  /**
   * filters pushed as a comma-separated list
   * @param filters
   */
  const handleFilterChanges = (filters: string | string[]) => {
    filters = filters.toString()
    // if removing last filter
    if (filters === "") {
      let updatedQueryParams: any = { ...queryToPush }
      // remove filter from query params so it doesn't display and empty filter query
      if (updatedQueryParams.filters) {
        delete updatedQueryParams.filters
      }
      setQueryToPush(updatedQueryParams)
      let query = updatedQueryParams
      route.push(URL_HREF, { pathname, query }, { shallow: true })
      return
    }

    let updatedQueryParams = { ...queryToPush, filters: filters }
    setQueryToPush(updatedQueryParams)
    let query = updatedQueryParams
    route.push(URL_HREF, { pathname, query }, { shallow: true })
  }

  const availableAnswers = searchResults
    ? searchResults
    : allAnswers
    ? allAnswers
    : { results: [], total: 0 }

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
        answers={allAnswersInContext}
        handleTextSearch={handleTextSearch}
      />
      <AnswerListWrapper
        order={sortOrder}
        quizId={quizId}
        size={answersDisplayed}
        handlePageChange={handlePageChange}
        page={currentPage}
        answersError={answersError}
        fetchingAnswers={fetchingAnswers}
        answers={allAnswersInContext}
      />
    </>
  )
}

export default AllAnswers
