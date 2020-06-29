import React, { useContext, useState, useEffect } from "react"
import { Breadcrumbs, Typography } from "@material-ui/core"
import Link from "next/link"
import BreadCrumbContext from "../contexts/BreadCrumbContext"
import { Alert, Skeleton } from "@material-ui/lab"
import styled from "styled-components"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem !important;
`

const BreadCrumb = () => {
  const [loading, setLoading] = useState(true)
  const { breadCrumbs } = useContext(BreadCrumbContext)
  const breadCrumbsNotDefined = breadCrumbs.length === 0
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
  if (loading && breadCrumbsNotDefined) {
    return <StyledSkeleton variant="rect" height={50} />
  }
  if (breadCrumbsNotDefined) {
    return (
      <Alert severity="warning">
        This page has not specified the contents of breadcrumb.
      </Alert>
    )
  }
  return (
    <StyledBreadcrumbs separator=">">
      {breadCrumbs.map(crumb => (
        <div key={crumb.label}>
          {crumb.as && crumb.href ? (
            <Link href={crumb.href} as={crumb.as}>
              <a>{crumb.label}</a>
            </Link>
          ) : (
            <Typography>{crumb.label}</Typography>
          )}
        </div>
      ))}
    </StyledBreadcrumbs>
  )
}

export default BreadCrumb
