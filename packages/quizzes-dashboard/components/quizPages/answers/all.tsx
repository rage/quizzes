import React, { useState } from "react"
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
  StyledSkeleton,
  OptionsContainer,
  SwitchField,
  SortOrderField,
  FilterParamsField,
} from "./styles"
import {
  IQueryParams,
  TSortOptions,
  TAnswersDisplayed,
  ChipProps,
} from "./types"
import { StyledTitle } from "../../Answer/CardContent/Peerreviews/Review"
import AnswerListWrapper from "../../AnswerListWrapper"

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

export const AllAnswers = (props: IQueryParams) => {
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
  paramExpand = paramExpand === "true" ? true : false

  const [currentPage, setCurrentPage] = useState<number>(paramPage || 1)
  const [sortOrder, setSortOrder] = useState<TSortOptions>(paramSort || "desc")
  const [expandAll, setExpandAll] = useState<boolean>(paramExpand || false)
  const [answersDisplayed, setAnswersDisplayed] = useState<TAnswersDisplayed>(
    paramSize || 10,
  )
  const [filterParameters, setFilterParameters] = useState<string[]>([])
  const states: { [state: string]: { checked: boolean } } = {
    "manual-review": { checked: false },
    rejected: { checked: false },
    "manual-review-once-given-and-received-enough": { checked: false },
    draft: { checked: false },
    "given-enough": { checked: false },
    confirmed: { checked: false },
    "given-more-than-enough": { checked: false },
    deprecated: { checked: false },
    "enough-received-but-not-given": { checked: false },
    submitted: { checked: false },
    "manual-review-once-given-enough": { checked: false },
    spam: { checked: false },
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
      as: `/courses/${quiz?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: `${quiz ? quiz.title : ""}`,
    },
  ])

  if (!quiz || !course) {
    return (
      <>
        <TabTextLoading />
        <StyledSkeleton variant="rect" animation="wave" height={500} />
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
      <TabText text="All answers" />
      <QuizTitle quiz={quiz} course={course} />
      <OptionsContainer>
        <SwitchField>
          <Typography>Expand all</Typography>
          <Switch
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
          helperText="How many answers are shown per page"
          select
          onChange={event => {
            handleChange(event, "pages")
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
          onChange={event => handleChange(event, "order")}
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

                if (chipStates[state].checked) {
                  const newParams = _.clone(filterParameters)
                  setFilterParameters(newParams.concat(state))
                } else {
                  const newParams = _.clone(filterParameters)
                  setFilterParameters(
                    newParams.filter(param => param !== state),
                  )
                }
              }}
            />
          )
        })}
      </FilterParamsField>
      <AnswerListWrapper
        expandAll={expandAll}
        filterparameters={filterParameters}
        order={sortOrder}
        quizId={quizId}
        size={answersDisplayed}
        handleChange={handlePageChange}
        page={currentPage}
      />
    </>
  )
}

export default AllAnswers
