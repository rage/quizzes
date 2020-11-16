import { Typography } from "@material-ui/core"
import React from "react"
import { Quiz } from "../../types/Quiz"
import { QuizOfSection } from "./SectionQuiz"

interface sectionProps {
  section: string
  quizzes: Quiz[]
  requiringAttention: { [quizId: string]: number }
}

export const SectionOfPart = ({
  section,
  quizzes,
  requiringAttention,
}: sectionProps) => {
  return (
    <>
      <Typography variant="h6">Section {section}</Typography>
      {quizzes.map(quiz => {
        return (
          <QuizOfSection
            key={quiz.id}
            quiz={quiz}
            requiringAttention={requiringAttention[quiz.id]}
          />
        )
      })}
    </>
  )
}

export default SectionOfPart
