import React, { useEffect } from "react"
import { useTypedSelector } from "../../store/store"
import QuizItem from "./QuizItem"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSitemap } from "@fortawesome/free-solid-svg-icons"
import { Typography, Divider } from "@material-ui/core"
import AddQuizItem from "./AddQuizItem"
import { useDispatch } from "react-redux"
import { checkForChanges } from "../../store/editor/editorActions"

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
  const dispatch = useDispatch()
  const store = useTypedSelector(state => state)
  const storeItems = Object.values(
    useTypedSelector(state => state.editor.items),
  )

  useEffect(() => {
    dispatch(checkForChanges(store))
  }, [store])

  storeItems.sort((item1, item2) => item1.order - item2.order)
  return (
    <>
      <ItemsTitleContainer>
        <SubsectionTitleWrapper>
          <TitleIcon icon={faSitemap} />
          <Typography variant="h2">Quiz items</Typography>
        </SubsectionTitleWrapper>{" "}
      </ItemsTitleContainer>
      {storeItems.map(item => {
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
