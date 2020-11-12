import * as React from "react"
import { Grid } from "@material-ui/core"
import { QuizItem } from "../modelTypes"
import { SpaciousPaper } from "./styleComponents"
import { useTypedSelector } from "../state/store"
import MarkdownText from "./MarkdownText"

type Props = {
  item: QuizItem
}

const LaterQuizItemAddition: React.FunctionComponent<Props> = ({ item }) => {
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  // should not occur - QuizImpl will not render items if language not set
  if (!languageInfo) {
    return <div>Language not set</div>
  }
  const message = languageInfo.general.answerMissingBecauseQuizModifiedLabel

  return (
    <Grid container={true}>
      <Grid item={true} xs={12} md={6}>
        <MarkdownText>{`${item.title} (${item.type})`}</MarkdownText>
      </Grid>
      <Grid item={true} xs={12} md={6}>
        <SpaciousPaper style={{ backgroundColor: "lightgray" }}>
          {message}
        </SpaciousPaper>
      </Grid>
    </Grid>
  )
}

export default LaterQuizItemAddition
