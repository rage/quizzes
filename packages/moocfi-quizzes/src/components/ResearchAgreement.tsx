import * as React from "react"
import CheckboxOption from "./CheckboxOption"

type ResearchAgreementProps = {
  optionAnswers: any[]
  item: any
  handleCheckboxToggling: (any) => any
}

const ResearchAgreement: React.FunctionComponent<ResearchAgreementProps> = ({
  item,
  optionAnswers,
  handleCheckboxToggling,
}) => {
  const options = item.options

  return (
    <>
      {options.map(option => {
        return (
          <CheckboxOption
            key={option.id}
            handleCheckboxToggling={handleCheckboxToggling(option.id)}
            item={item}
            optionAnswers={optionAnswers}
          />
        )
      })}
    </>
  )
}

export default ResearchAgreement
