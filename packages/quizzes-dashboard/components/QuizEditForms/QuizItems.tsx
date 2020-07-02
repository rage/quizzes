import React from "react"
import { useTypedSelector } from "../../store/store"
import QuizItem from "./QuizItem"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSitemap } from "@fortawesome/free-solid-svg-icons"
import { Typography, Divider } from "@material-ui/core"

const SubsectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: center;
`

const TitleIcon = styled(FontAwesomeIcon)`
  width: 2rem;
  height: 2rem;
  margin-right: 0.25rem;
`
const QuizItems = () => {
  const storeItems = Object.values(
    useTypedSelector(state => state.editor.items),
  )
  return (
    <>
      <SubsectionTitleWrapper>
        <TitleIcon icon={faSitemap} />
        <Typography variant="h2">Quiz items</Typography>
      </SubsectionTitleWrapper>
      {storeItems.map(item => {
        return (
          <div key={item.id}>
            <QuizItem item={item} />
            <Divider variant="fullWidth" />
          </div>
        )
      })}
    </>
  )
}

export default QuizItems
