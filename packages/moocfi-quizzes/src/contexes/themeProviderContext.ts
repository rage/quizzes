import { createContext } from "react"
import { ChoiceButtonHOCProps } from "../components/ChoiceButton"

export interface ThemeProviderInterface {
  choiceButton?: React.FunctionComponent<ChoiceButtonHOCProps>
}

const ThemeProviderContext = createContext<ThemeProviderInterface>({})

export default ThemeProviderContext
