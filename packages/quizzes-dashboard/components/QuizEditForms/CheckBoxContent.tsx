import React from "react"
import BasicInformation from "./BasicInfo"
import { EditableQuiz, Item } from "../../types/EditQuiz"
import styled from "styled-components"
import { Typography } from "@material-ui/core"

interface contentBoxProps {
  item: Item
}

const Container = styled.div`
  display: flex;
  padding: 1rem;
`

const CheckBoxContent = ({ item }: contentBoxProps) => {
  return (
    <>
      <Container>
        <Typography>CheckBoxContent</Typography>
      </Container>
    </>
  )
}

export default CheckBoxContent
