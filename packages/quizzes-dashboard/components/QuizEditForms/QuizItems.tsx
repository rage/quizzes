import React, { useEffect } from "react"

import { useDispatch } from "react-redux"
import styled from "styled-components"

import { faSitemap } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Typography, Divider } from "@mui/material"

import { checkForChanges } from "../../store/editor/editorActions"
import { useTypedSelector } from "../../store/store"
import AddQuizItem from "./AddQuizItem"
import QuizItem from "./QuizItem"

const ItemsTitleContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  justify-content: center;
`

const SubsectionTitleWrapper = styled.div`
  display: flex;
  width: auto;
`

const TitleIcon = styled(FontAwesomeIcon)`
  width: 2rem;
  height: 2rem;
  margin-right: 0.25rem;
`

const QuizItems = () => {
  const storeItems = Object.values(
    useTypedSelector((state) => state.editor.items),
  )

  storeItems.sort((item1, item2) => item1.order - item2.order)
  return (
    <>
      <ItemsTitleContainer>
        <SubsectionTitleWrapper>
          <TitleIcon icon={faSitemap} />
          <Typography variant="h2">Quiz items</Typography>
        </SubsectionTitleWrapper>{" "}
      </ItemsTitleContainer>
      {storeItems.map((item) => {
        return (
          <div key={item.id}>
            <QuizItem item={item} />
            <Divider variant="fullWidth" />
          </div>
        )
      })}
      <AddQuizItem />
    </>
  )
}

export default QuizItems
