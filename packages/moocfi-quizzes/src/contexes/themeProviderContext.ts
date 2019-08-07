import { createContext } from "react"
import { ChoiceButtonProps } from "../components/ChoiceButton"
import { SubmitButtonProps } from "../components/QuizImpl/SubmitButton"

export interface ThemeProviderInterface {
  choiceButton?: React.FunctionComponent<ChoiceButtonProps>
  submitButton?: React.FunctionComponent<SubmitButtonProps>
}

const ThemeProviderContext = createContext<ThemeProviderInterface>({})

export default ThemeProviderContext
