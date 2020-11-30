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
      {Array.from({ length: skeletonCount }, (_, i) => (
        <StyledSkeleton
          key={i}
          variant="rect"
          height={height}
          animation="wave"
        />
      ))}
    </>
  )
}

export default SkeletonLoader
