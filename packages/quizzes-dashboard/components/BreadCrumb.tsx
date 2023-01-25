import React, { useContext, useEffect, useState } from "react"
import BreadCrumbContext from "../contexts/BreadCrumbContext"
import { Breadcrumbs, Typography } from "@material-ui/core"
import Link from "next/link"
import styled from "styled-components"


const BreadCrumbContainer = styled(Breadcrumbs)`
  text-decoration: none;
  cursor: pointer;
  height: 40px;
  background-color: white;
  border-bottom: 1px solid #D3D3D3;
  color: black;
  display: flex;
  align-items:center;
  padding-left: 12px;
  position: relative;
`


const BreadCrumbText = styled.p`
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 1rem;
    
    &:hover {
        text-decoration: underline;
    }

  
`

const BreadCrumbLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  font-size: 1rem;
  color: #757575;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`

const BreadCrumbs: React.FC = () => {
  const { breadCrumbs } = useContext(BreadCrumbContext)

  return (
    <BreadCrumbContainer>
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
    </BreadCrumbContainer>
  )
}

export default BreadCrumbs