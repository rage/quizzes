import React from "react"
import { StyledSkeleton } from "../quizPages/answers/styles"

export const SkeletonLoader = ({
  height,
  skeletonCount,
}: {
  height: number
  skeletonCount: number
}) => {
  return (
    <>
      {Array(skeletonCount).fill(
        <StyledSkeleton variant="rect" height={height} animation="wave" />,
      )}
    </>
  )
}

export default SkeletonLoader
