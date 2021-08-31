import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Link as LinkTypography, Typography } from "@material-ui/core"
import styled from "styled-components"
import { useRouter } from "next/router"
import { Answer, ItemAnswer } from "../../../types/Answer"
import ItemAnswers from "./ItemAnswers"
import { getPlagiarismSourceAnswers } from "../../../services/quizzes"

export const AnswerLinkContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 100%;
`
export const ContentContainer = styled.div`
  display: flex !important;
  margin-bottom: 1rem;
  justify-content: space-between !important;
  width: 100%;
  align-items: center;
`
export interface PlagiarismSourcesProps {
  answerId: string
}

export const PlagiarismSources = ({ answerId }: PlagiarismSourcesProps) => {
  const [answers, setAnswers] = useState<Answer[]>([])

  const getAnswers = async (answerId: string) => {
    try {
      const ansList: Answer[] = await getPlagiarismSourceAnswers(answerId)
      setAnswers(ansList)
    } catch (e) {}
  }

  useEffect(() => {
    getAnswers(answerId)
  }, [])

  return (
    <>
      <Typography>Possible plagiarism sources:</Typography>

      {answers != undefined &&
        answers.length > 0 &&
        answers.map(ans => (
          <ContentContainer>
            <blockquote>
              <ContentContainer>
                <ItemAnswers itemAnswers={ans.itemAnswers} />
              </ContentContainer>
            </blockquote>
          </ContentContainer>
        ))}
    </>
  )
}

export default PlagiarismSources
