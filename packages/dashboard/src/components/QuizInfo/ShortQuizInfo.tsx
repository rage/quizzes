import {
  Button,
  Grid,
  Input,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core"
import Create from "@material-ui/icons/Create"
import React from "react"
import { ILanguage, QuizPointsGrantingPolicy } from "../../interfaces"
import TogglableQuizInstruction from "./TogglableQuizInstruction"

interface IProps {
  body: string
  courseLanguages: ILanguage[]
  filterLanguage: string
  onExpand: (a: any) => any
  title: string
  tries: number
  triesLimited: boolean
  grantPointsPolicy: QuizPointsGrantingPolicy
}

const ShortQuizInfo: React.FunctionComponent<IProps> = ({
  filterLanguage,
  courseLanguages,
  title,
  body,
  onExpand,
  tries,
  triesLimited,
  grantPointsPolicy,
}) => (
  <Grid container={true} justify="space-between">
    <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
      <Typography variant="title" paragraph={true}>{`${title}`}</Typography>
    </Grid>

    <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
      <Select
        value={filterLanguage}
        input={<Input id="language-readonly" name="language" disabled={true} />}
      >
        {courseLanguages.map(languageInfo => {
          return (
            <MenuItem value={languageInfo.id} key={languageInfo.id}>
              {languageInfo.name}
            </MenuItem>
          )
        })}
      </Select>
    </Grid>

    <Grid item={true} xs={12}>
      <Typography variant="subtitle1">
        Number of tries that are allowed:
        {triesLimited ? ` ${tries}` : " No limit"}
      </Typography>
    </Grid>

    <Grid item={true} xs={12}>
      <Typography variant="subtitle1">
        Point granting policy:
        {grantPointsPolicy === "grant_whenever_possible"
          ? " each item answer granted separately"
          : " only when all item answers correct"}
      </Typography>
    </Grid>

    <Grid
      item={true}
      xs={12}
      style={{ marginBottom: "2rem", marginTop: "1rem" }}
    >
      <TogglableQuizInstruction bodyText={body} />
    </Grid>
    <Grid item={true} xs={4}>
      <Button variant="contained" style={{ color: "gray" }} onClick={onExpand}>
        Edit
        <Create fontSize="small" style={{ marginLeft: ".5em" }} />
      </Button>
    </Grid>
  </Grid>
)

export default ShortQuizInfo
