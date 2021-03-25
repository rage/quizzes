import { ThemeProviderInterface } from "../../../src/contexes/themeProviderContext"
import ChoiceButton from "./ChoiceButton"
import SubmitButton from "./SubmitButton"
import SpamButton from "./SpamButton"
import SelectButton from "./SelectButton"
import PeerReviewSubmitButton from "./PeerReviewSubmitButton"
import FeedbackMessage from "./FeedbackMessage"
import styles from "./styles"
import TopInfoBarIcon from "./TopInfoBarIcon"
import ItemWrapper from "./ItemWrapper"
import LowerContent from "./LowerContent"
import QuizContent from "./QuizContent"
import TopInfoBarContainer from "./TopInfoBarContainer"

const ThemeProviderImpl: ThemeProviderInterface = {
  // choiceButton: ChoiceButton,
  // submitButton: SubmitButton,
  // spamButton: SpamButton,
  // selectButton: SelectButton,
  // peerReviewSubmitButton: PeerReviewSubmitButton,
  // feedbackMessage: FeedbackMessage,
  // topInfoBarContainer: TopInfoBarContainer,
  // topInfoBarIcon: TopInfoBarIcon,
  // mainDivStyles: styles.mainDiv,
  // itemWrapper: ItemWrapper,
  // optionWrapperStyles: styles.optionWrapper,
  // essayItemContentStyles: styles.essayItemContent,
  // multipleChoiceItemContentStyles: styles.multipleChoiceItemContent,
  // wideOpenItemContentStyles: styles.wideOpenItemContent,
  // narrowOpenItemContentStyles: styles.narrowOpenItemContent,
  // upperContentStyles: styles.upperContent,
  // lowerContent: LowerContent,
  // submitMessageDivStyles: styles.submitMessageDiv,
  // answerPaperStyles: styles.answerPaper,
  // answerFieldStyles: styles.answerField,
  quizBodyStyles: styles.quizBody,
  // stepperStyles: styles.stepper,
  // submitGroupStyles: styles.submitGroup,
  // messageGroupStyles: styles.messageGroup,
  // questionBlockWrapperStyles: styles.questionBlockWrapper,
  // likertSeparatorType: "striped",
  // buttonWrapperStyles: styles.buttonWrapper,
  // quizContent: QuizContent,
  // peerReviewGuidanceStyles: styles.peerReviewGuidance,
  // peerReviewFormStyles: styles.peerReviewForm,
  // receivedPeerReviewsStyles: styles.receivedPeerReviews,
  // peerReviewContainerStyles: styles.peerReviewContainer,
  // optionContainerStyles: styles.optionContainer,
}

export default ThemeProviderImpl
