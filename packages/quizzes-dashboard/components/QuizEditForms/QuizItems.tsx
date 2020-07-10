import React from "react"
import { useTypedSelector } from "../../store/store"
import QuizItem from "./QuizItem"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSitemap,
  faPlusCircle,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons"
import {
  Typography,
  Divider,
  Button,
  Modal,
  Box,
  Fade,
} from "@material-ui/core"
import { useDispatch } from "react-redux"
import { setAddNewQuizItem } from "../../store/editor/quizVariables/quizVariableActions"
import AddQuizitemView from "./AddQuizitemModal"

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

const AddItemButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const AdvancedBox = styled(Box)`
  background-color: #fafafa;
  min-width: 1000px;
  min-height: 800px;
`

const CloseButton = styled(Button)`
  padding: 1rem !important;
  float: right;
`

const QuizItems = () => {
  const storeItems = Object.values(
    useTypedSelector(state => state.editor.items),
  )
  const quizId = useTypedSelector(state => state.editor.quizId)
  const variables = useTypedSelector(
    state => state.editor.quizVariables[quizId],
  )
  const dispatch = useDispatch()
  return (
    <>
      <StyledModal
        open={variables.addingNewItem}
        onClose={() => dispatch(setAddNewQuizItem(quizId, false))}
      >
        <Fade in={variables.addingNewItem}>
          <AdvancedBox>
            <CloseButton
              onClick={() => dispatch(setAddNewQuizItem(quizId, false))}
            >
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </CloseButton>
            <AddQuizitemView />
          </AdvancedBox>
        </Fade>
      </StyledModal>
      <ItemsTitleContainer>
        <SubsectionTitleWrapper>
          <TitleIcon icon={faSitemap} />
          <Typography variant="h2">Quiz items</Typography>
        </SubsectionTitleWrapper>
        <AddItemButtonWrapper>
          <Button
            onClick={() => dispatch(setAddNewQuizItem(quizId, true))}
            title="Add new quiz item"
          >
            <FontAwesomeIcon icon={faPlusCircle} size="2x" color="blue" />
          </Button>
        </AddItemButtonWrapper>
      </ItemsTitleContainer>
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
