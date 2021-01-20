import React from "react"
import { StyledSkeleton } from "../quizPages/answers/styles"

export const SkeletonLoader = ({
  height,
  skeletonCount,
  ...props
}: {
  height: number
  skeletonCount: number
  props?: any
}) => {
  return (
    <>
      {Array.from({ length: skeletonCount }, (_, i) => (
        <StyledSkeleton
          key={i}
          variant="rect"
          height={height}
          animation="wave"
          {...props}
        />
      ))}
    </>
  )
}

export default SkeletonLoader
