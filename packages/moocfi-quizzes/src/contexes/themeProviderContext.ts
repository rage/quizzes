import { createContext } from "react"
import { ChoiceButtonProps } from "../components/ChoiceButton"
import { SubmitButtonProps } from "../components/QuizImpl/SubmitButton"
import { LeftBorderedDivProps } from "../components/MultipleChoice"

export interface ThemeProviderInterface {
  choiceButton?: React.FunctionComponent<ChoiceButtonProps>
  submitButton?: React.FunctionComponent<SubmitButtonProps>
  feedbackMessage?: React.FunctionComponent<LeftBorderedDivProps>
  topInfoBarStyles?: string
  topInfoBarIcon?: React.FunctionComponent<any>
  mainDivStyles?: string
  itemWrapperStyles?: string
  optionGridItemStyles?: string
}

const ThemeProviderContext = createContext<ThemeProviderInterface>({})

export default ThemeProviderContext
