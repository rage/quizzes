import Typography from "@material-ui/core/Typography"
import React from "react"
import CheckboxOption from "./Checkbox/CheckboxOption"

const ResearchAgreement = ({
  itemBody,
  itemTitle,
  options,
  optionAnswers,
  answered,
  handleCheckboxToggling,
}) => {
  return (
    <React.Fragment>
      {options.map(option => {
        const currentAnswer = optionAnswers.find(
          oa => oa.quizOptionId === option.id,
        )

        return (
          <React.Fragment key={option.id}>
            <Typography variant="h6" style={{ paddingBottom: 10 }}>
              {itemTitle}
            </Typography>
            {itemBody && (
              <Typography
                variant="body1"
                style={{ paddingBottom: 10 }}
                dangerouslySetInnerHTML={{ __html: itemBody }}
              />
            )}

            <CheckboxOption
              label={option.texts[0].title}
              value={currentAnswer}
              toggle={handleCheckboxToggling(option.id)}
              answered={answered}
            />
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

export default ResearchAgreement
