import React, { useState } from "react"
import { Button, Modal, Box } from "@material-ui/core"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { Course } from "../../types/Quiz"
import DuplicateModal from "./DuplicateModal"
import CorrespondenceModal from "./CorrespondenceModal"

const StyledModal = styled(Modal)`
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
`

const AdvancedBox = styled(Box)`
  background-color: #fafafa !important;
  min-width: 600px !important;
  max-width: 600px !important;
  max-height: 500 px !important;
  min-height: 500px !important;
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
  background: #90caf9 !important;
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
  width: 30% !important;
`

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`

interface DuplicateCourseProps {
  course: Course
}

export const DuplicateCourseButton = ({ course }: DuplicateCourseProps) => {
  const [duplicateModal, showDuplicateModal] = useState(false)
  const [correspondenceModal, showCorrespondenceModal] = useState(false)
  return (
    <>
      <ButtonContainer>
        <StyledModal
          open={duplicateModal}
          onClose={() => showDuplicateModal(false)}
        >
          <AdvancedBox>
            <ButtonWrapper>
              <CloseButton onClick={() => showDuplicateModal(false)}>
                <FontAwesomeIcon icon={faWindowClose} />
              </CloseButton>
            </ButtonWrapper>
            <DuplicateModal course={course} />
          </AdvancedBox>
        </StyledModal>

        <StyledModal
          open={correspondenceModal}
          onClose={() => showCorrespondenceModal(false)}
        >
          <AdvancedBox>
            <ButtonWrapper>
              <CloseButton onClick={() => showCorrespondenceModal(false)}>
                <FontAwesomeIcon icon={faWindowClose} />
              </CloseButton>
            </ButtonWrapper>
            <CorrespondenceModal course={course} />
          </AdvancedBox>
        </StyledModal>

        <StyledButton
          variant="outlined"
          onClick={() => showDuplicateModal(true)}
        >
          Duplicate course
        </StyledButton>
        <StyledButton
          variant="outlined"
          onClick={() => showCorrespondenceModal(true)}
        >
          Download the correspondence file
        </StyledButton>
      </ButtonContainer>
    </>
  )
}

export default DuplicateCourseButton
