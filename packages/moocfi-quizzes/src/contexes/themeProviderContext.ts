import { createContext } from "react"
import { ChoiceButtonProps } from "../components/ChoiceButton"
import { SubmitButtonProps } from "../components/QuizImpl/SubmitButton"
import { LeftBorderedDivProps } from "../components/MultipleChoice"
import { SpamButtonProps } from "../components/PeerReviews/SpamButton"
import { SelectButtonProps } from "../components/PeerReviews/SelectButton"
import { PeerReviewSubmitButtonProps } from "../components/PeerReviews/PeerReviewSubmitButton"

export interface ThemeProviderInterface {
  choiceButton?: React.FunctionComponent<ChoiceButtonProps>
  submitButton?: React.FunctionComponent<SubmitButtonProps>
  spamButton?: React.FunctionComponent<SpamButtonProps>
  selectButton?: React.FunctionComponent<SelectButtonProps>
  peerReviewSubmitButton?: React.FunctionComponent<PeerReviewSubmitButtonProps>
  feedbackMessage?: React.FunctionComponent<LeftBorderedDivProps>
  topInfoBarStyles?: string
  topInfoBarIcon?: React.FunctionComponent<any>
  mainDivStyles?: string
  itemWrapperStyles?: string
  optionGridItemStyles?: string
}

const ThemeProviderContext = createContext<ThemeProviderInterface>({})

export default ThemeProviderContext
