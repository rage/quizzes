import React, { useState } from "react"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { fetchQuiz, fetchCourseById } from "../../../services/quizzes"
import usePromise from "react-use-promise"
import {
  TextField,
  MenuItem,
  Switch,
  Typography,
  Chip,
} from "@material-ui/core"
import styled from "styled-components"
import { Skeleton } from "@material-ui/lab"
import QuizTitle from "../QuizTitleContainer"
import { TabTextLoading, TabTextError, TabText } from "../TabHeaders"
import _ from "lodash"
import AnswerListWrapper from "../../AnswerListWrapper"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
  margin-top: 1rem;
`

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const SizeSelectorField = styled(TextField)`
  display: flex !important;
  width: 33%;
`

export const SwitchField = styled.div`
  display: flex;
  align-items: baseline;
  width: 33%;
`

export const SortOrderField = styled(TextField)`
  display: flex !important;
  width: 33%;
`
const FilterParamsField = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  margin-bottom: 2rem;
`
const StyledTitle = styled(Typography)`
  display: flex !important;
  width: 100% !important;
`

interface ChipProps {
  checked: boolean
}
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
export const AllAnswers = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""

  const [size, setSize] = useState(10)
  const [order, setOrder] = useState("desc")
  const [expandAll, setExpandAll] = useState(false)
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
              setExpandAll(event.target.checked)
            }}
          />
        </SwitchField>
        <SizeSelectorField
          value={size}
          size="medium"
          label="Answers"
          variant="outlined"
          helperText="How many answers are shown per page"
          select
          onChange={event => {
            setSize(Number(event.target.value))
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
          value={order}
          onChange={event => setOrder(event.target.value)}
        >
          <MenuItem value="desc">Latest first</MenuItem>
          <MenuItem value="asc">Oldest first</MenuItem>
        </SortOrderField>
      </OptionsContainer>
      <FilterParamsField>
        <StyledTitle variant="subtitle1">Status filters</StyledTitle>
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
        order={order}
        quizId={quizId}
        size={size}
      />
    </>
  )
}

export default AllAnswers
