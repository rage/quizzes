import React from "react"
import StageVisualizer from "./StageVisualizer"
import StageSelector from "./StageSelector"

export default props => {
  const essays = props.quiz.items
    .filter(item => item.type === "essay")
    .sort((qi1, qi2) => qi1.order - qi2.order)

  const itemAnswers = props.quizAnswer.itemAnswers
    .filter(ia => {
      const item = props.quiz.items.find(qi => qi.id === ia.quizItemId)
      return item.type === "essay"
    })
    .sort((e1, e2) => {
      const qi1 = props.quiz.items.find(qi => qi.id === e1.quizItemId)
      const qi2 = props.quiz.items.find(qi => qi.id === e2.quizItemId)
      return qi1.order - qi2.order
    })

  return (
    <div>
      <h2>Essays</h2>
      <StageVisualizer {...props} />
      <StageSelector
        {...props}
        quizId={props.quiz.id}
        essays={essays.sort((e1, e2) => e1.order - e2.order)}
        itemAnswers={itemAnswers}
      />
    </div>
  )
}
