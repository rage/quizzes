import Typography from "@material-ui/core/Typography"
import React from "react"
import CheckboxOption from "./CheckboxOption"

export default ({
  answered,
  itemBody,
  itemTitle,
  options,
  optionAnswers,
  handleCheckboxToggling,
}) => {
  return (
    <React.Fragment>
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
        label={options[0].texts[0].title}
        value={optionAnswers[0]}
        toggle={handleCheckboxToggling(options[0].id)}
        answered={answered}
      />
    </React.Fragment>
  )
}
