import React from "react"
import EssayStageContainer from "./EssayStageContainer"

const EssaysStageContainer = ({
  itemAnswers,
  essays,
  handleTextDataChange,
}) => {
  return (
    <React.Fragment>
      {essays.map(qi => {
        const itemAnswer = itemAnswers.find(ia => ia.quizItemId === qi.id)

        return (
          <div key={qi.id}>
            <EssayStageContainer
              itemTitle={qi.texts[0].title}
              itemBody={qi.texts[0].body}
              textData={itemAnswer.textData}
              handleTextDataChange={handleTextDataChange(qi.id)}
            />
          </div>
        )
      })}
    </React.Fragment>
  )
}

export default EssaysStageContainer
