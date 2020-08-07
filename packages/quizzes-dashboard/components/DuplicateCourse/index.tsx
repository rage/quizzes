import React, { useState } from "react"
import { Button, Modal, Box } from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { Course } from "../../types/Quiz"
import DuplicateModal from "./DuplicateModal"
import CorrespondanceModal from "./CorrespondanceModal"

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const AdvancedBox = styled(Box)`
  background-color: #fafafa;
  min-width: 500px;
  min-height: 400px;
`

const CloseButton = styled(Button)`
  display: flex !important;
`

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 1rem;
  margin-right: 1rem;
`

const StyledButton = styled(Button)`
  display: flex;
  background: #3f51b5 !important;
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
`

const ButtonContainer = styled.div`
  display: flex;
  width: 30%;
  flex-wrap: wrap;
`

interface DuplicateCourseProps {
  course: Course
}

export const DuplicateCourseButton = ({ course }: DuplicateCourseProps) => {
  const [duplicateModal, showDuplicateModal] = useState(false)
  const [correspondanceModal, showCorrespondanceModal] = useState(false)
  return (
    <>
      <StyledModal open={duplicateModal}>
        <AdvancedBox>
          <ButtonWrapper>
            <CloseButton onClick={() => showDuplicateModal(false)}>
              <FontAwesomeIcon icon={faWindowClose} />
            </CloseButton>
          </ButtonWrapper>
          <DuplicateModal course={course} />
        </AdvancedBox>
      </StyledModal>

      <StyledModal open={correspondanceModal}>
        <AdvancedBox>
          <ButtonWrapper>
            <CloseButton onClick={() => showCorrespondanceModal(false)}>
              <FontAwesomeIcon icon={faWindowClose} />
            </CloseButton>
          </ButtonWrapper>
          <CorrespondanceModal course={course} />
        </AdvancedBox>
      </StyledModal>

      <ButtonContainer>
        <StyledButton
          variant="outlined"
          onClick={() => showDuplicateModal(true)}
        >
          Duplicate course
        </StyledButton>
        <StyledButton
          variant="outlined"
          onClick={() => showCorrespondanceModal(true)}
        >
          Download the correspondance file
        </StyledButton>
      </ButtonContainer>
    </>
  )
}

export default DuplicateCourseButton
