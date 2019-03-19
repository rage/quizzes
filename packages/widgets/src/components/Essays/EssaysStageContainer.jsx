import React from "react"
import EssayStageContainer from "./EssayStageContainer"

const EssayStageContainer = ({ itemAnswers, essays, handleTextDataChange }) => {
  ;<React.Fragment>
    {essays.map(qi => {
      const itemAnswer = props.quizAnswer.itemAnswers.find(
        ia => ia.quizItemId === qi.id,
      )

      return (
        <div key={qi.id}>
          <Typography variant="h6" style={{ paddingBottom: 10 }}>
            {qi.texts[0].title}
          </Typography>
          <Typography
            variant="body1"
            style={{ paddingBottom: 10 }}
            dangerouslySetInnerHTML={{ __html: qi.texts[0].body }}
          />
          <EssayStageContainer
            textData={itemAnswer.textData}
            handleTextDataChange={props.handleTextDataChange(qi.id)}
          />
        </div>
      )
    })}
  </React.Fragment>
}

export default EssayStageContainer
