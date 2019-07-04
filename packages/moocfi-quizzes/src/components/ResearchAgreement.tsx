import * as React from "react"
import CheckboxOption from "./CheckboxOption"
import { QuizItem } from "../modelTypes"

type ResearchAgreementProps = {
  item: QuizItem
}

const ResearchAgreement: React.FunctionComponent<ResearchAgreementProps> = ({
  item,
}) => {
  const options = item.options

  return (
    <>
      {options.map(option => {
        return <CheckboxOption key={option.id} item={item} />
      })}
    </>
  )
}

export default ResearchAgreement
