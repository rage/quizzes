import React, { useState, useEffect } from "react"
import _ from "lodash"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { fetchQuiz, fetchCourseById } from "../../../services/quizzes"
import usePromise from "react-use-promise"
import { MenuItem, Switch, Typography, Chip } from "@material-ui/core"
import styled from "styled-components"
import QuizTitle from "../QuizTitleContainer"
import { TabTextLoading, TabTextError, TabText } from "../TabHeaders"
import {
  SizeSelectorField,
  OptionsContainer,
  SwitchField,
  SortOrderField,
  FilterParamsField,
} from "./styles"
import { TSortOptions, TAnswersDisplayed, ChipProps } from "./types"
import { StyledTitle } from "../../Answer/CardContent/Peerreviews/Review"
import { Results } from "./results"
import SkeletonLoader from "../../Shared/SkeletonLoader"

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

export const AnswerSearch = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""

  const URL_HREF = `/quizzes/[quizId]/[...page]`
  const pathname = `/quizzes/${quizId}/search/`

  let paramSize = Number(route.query.answers) as TAnswersDisplayed
  let paramPage = Number(route.query.pageNo)
  let paramSort: TSortOptions | null = null
  if (route.query.sort) {
    paramSort = route.query.sort as TSortOptions
  }
  let paramExpand = route.query.expandAll === "true" ? true : false
  let paramFilters: any = null
  if (route.query.filters !== undefined) {
    let filtersAsString: string = route.query.filters.toString()
    paramFilters = filtersAsString.split(",")
  }

  const [currentPage, setCurrentPage] = useState<number>(paramPage || 1)
  const [sortOrder, setSortOrder] = useState<TSortOptions>(paramSort || "desc")
  const [expandAll, setExpandAll] = useState<boolean>(paramExpand || false)
  const [answersDisplayed, setAnswersDisplayed] = useState<TAnswersDisplayed>(
    paramSize || 10,
  )
  const [filterParameters, setFilterParameters] = useState<string[]>(
    paramFilters || [],
  )

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

  const [quiz, quizError] = usePromise(() => fetchQuiz(quizId), [])
  const [course, courseError] = usePromise(
    () => fetchCourseById(quiz?.courseId ?? ""),
    [quiz],
  )

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

  // this needs to be run so that if the page with query params is loaded in
  // another window, the params can be updated without clearing the rest first
  useEffect(() => {
    let initialQuery: any = {}

    if (paramPage) {
      initialQuery.pageNo = paramPage
    }
    if (paramSize) {
      initialQuery.answers = paramSize
    }
    if (paramExpand) {
      initialQuery.expandAll = paramExpand
    }
    if (paramSort) {
      initialQuery.sort = paramSort
    }
    if (paramFilters as any) {
      initialQuery.filters = paramFilters.toString()
    }
    setQueryToPush(initialQuery)
  }, [])

  if (!quiz || !course) {
    return (
      <>
        <TabTextLoading />
        <SkeletonLoader height={500} skeletonCount={1} />
      </>
    )
  }

  if (quizError || courseError) {
    return (
      <>
        <TabTextError />
        <div>Error while fetching answers.</div>
      </>
    )
  }

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
      case "filter":
        updatedQueryParams = { ...queryToPush, filters: event.target.value }
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

  return (
    <>
      <TabText text="Search" />
      <QuizTitle quiz={quiz} course={course} />
      <OptionsContainer>
        <SwitchField>
          <Typography>Expand all</Typography>
          <Switch
            checked={expandAll}
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
      <Results
        expandAll={expandAll}
        filterparameters={filterParameters}
        order={sortOrder}
        quizId={quizId}
        size={answersDisplayed}
        handlePageChange={handlePageChange}
        page={currentPage}
      />
    </>
  )
}

export default AnswerSearch
