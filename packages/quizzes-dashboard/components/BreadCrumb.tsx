import React, { useContext, useState, useEffect } from "react"
import { Breadcrumbs, Typography } from "@material-ui/core"
import Link from "next/link"
import BreadCrumbContext from "../contexts/BreadCrumbContext"
import { Alert, Skeleton } from "@material-ui/lab"
import styled from "styled-components"
import LoginStateContext from "../contexts/LoginStateContext"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const StyledBreadcrumbs = styled(Breadcrumbs)`
  .MuiBreadcrumbs-separator {
    color: white;
  }
`

const BreadCrumbText = styled(Typography)`
  display: flex !important;
  color: lavender !important;
`

const BreadCrumbLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`

const BreadCrumb = () => {
  const [loading, setLoading] = useState(true)
  const { breadCrumbs } = useContext(BreadCrumbContext)
  const breadCrumbsNotDefined = breadCrumbs.length === 0
  const { loggedIn } = useContext(LoginStateContext)
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
  if (breadCrumbsNotDefined && loggedIn) {
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
          {crumb.as ? (
            <Link href={crumb.as} passHref>
              <BreadCrumbLink>{crumb.label}</BreadCrumbLink>
            </Link>
          ) : (
            <BreadCrumbText>{crumb.label}</BreadCrumbText>
          )}
        </div>
      ))}
    </StyledBreadcrumbs>
  )
}

export default BreadCrumb
