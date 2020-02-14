import { createContext } from "react"
import { IItemWrapperProps, LowerContentProps } from "../components/QuizImpl"
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
  itemWrapper?: React.FunctionComponent<IItemWrapperProps>
  optionWrapperStyles?: string
  multipleChoiceItemContentStyles?: string
  narrowOpenItemContentStyles?: string
  wideOpenItemContentStyles?: string
  essayItemContentStyles?: string
  upperContentStyles?: string
  lowerContent?: React.FunctionComponent<LowerContentProps>
  submitMessageDivStyles?: string
  answerPaperStyles?: string
  answerFieldStyles?: string
  quizBodyStyles?: string
  stepperStyles?: string
  submitGroupStyles?: string
  messageGroupStyles?: string
}

const ThemeProviderContext = createContext<ThemeProviderInterface>({})

export default ThemeProviderContext
