import { Typography } from "@material-ui/core"
import React from "react"
import SkeletonLoader from "../Shared/SkeletonLoader"

interface IDisplayAnswers {
  answersAreBeingFetched: boolean
  answersAreAvailable: boolean
  errorFetchingAnswers: boolean
  noResults: boolean
  children?: React.ReactNode
}

export const DisplayAnswers = (props: IDisplayAnswers): JSX.Element | null => {
  const {
    children,
    answersAreBeingFetched,
    answersAreAvailable,
    errorFetchingAnswers,
    noResults,
  } = props

  if (answersAreBeingFetched)
    return <SkeletonLoader height={250} skeletonCount={4} />

  if (errorFetchingAnswers) {
    return (
      <Typography variant="h3">
        Something went wrong while retrieving answers.
      </Typography>
    )
  }
  if (noResults)
    return <Typography variant="h3">No answers available.</Typography>

  if (answersAreAvailable && children) return <>{children}</>

  return null
}

export default DisplayAnswers
