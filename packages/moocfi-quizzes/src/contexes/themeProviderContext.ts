import { createContext } from "react"
import {
  IItemWrapperProps,
  LowerContentProps,
  QuizContentProps,
} from "../components/QuizImpl/"
import { MenuItemProps } from "../components/MenuItem"
import { ChoiceButtonProps } from "../components/ChoiceButton"
import { SubmitButtonProps } from "../components/QuizImpl/SubmitButton"
import { LeftBorderedDivProps } from "../components/MultipleChoice"
import { SpamButtonProps } from "../components/PeerReviews/SpamButton"
import { SelectButtonProps } from "../components/PeerReviews/SelectButton"
import { PeerReviewSubmitButtonProps } from "../components/PeerReviews/PeerReviewSubmitButton"
import { TopInfoBarContainerProps } from "../components/QuizImpl/TopInfoBar"

export interface ThemeProviderInterface {
  menuItem?: React.FunctionComponent<MenuItemProps>
  choiceButton?: React.FunctionComponent<ChoiceButtonProps>
  submitButton?: React.FunctionComponent<SubmitButtonProps>
  spamButton?: React.FunctionComponent<SpamButtonProps>
  selectButton?: React.FunctionComponent<SelectButtonProps>
  peerReviewSubmitButton?: React.FunctionComponent<PeerReviewSubmitButtonProps>
  feedbackMessage?: React.FunctionComponent<LeftBorderedDivProps>
  topInfoBarContainer?: React.FunctionComponent<TopInfoBarContainerProps>
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
  quizContent?: React.FunctionComponent<QuizContentProps>
  submitMessageDivStyles?: string
  answerPaperStyles?: string
  answerFieldStyles?: string
  quizBodyStyles?: string
  stepperStyles?: string
  submitGroupStyles?: string
  messageGroupStyles?: string
  likertSeparatorType?: "dotted-line" | "striped"
  questionBlockWrapperStyles?: string
  buttonWrapperStyles?: string
  peerReviewGuidanceStyles?: string
  peerReviewFormStyles?: string
  receivedPeerReviewsStyles?: string
  peerReviewContainerStyles?: string
  optionContainerStyles?: string
}

const ThemeProviderContext = createContext<ThemeProviderInterface>({})

export default ThemeProviderContext
