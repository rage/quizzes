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
import { ILanguage } from "../../interfaces"
import TogglableQuizInstruction from "./TogglableQuizInstruction"

interface IProps {
  body: string
  courseLanguages: ILanguage[]
  filterLanguage: string
  onExpand: (a: any) => any
  title: string
  tries: number
  triesLimited: boolean
}

const ShortQuizInfo: React.FunctionComponent<IProps> = ({
  filterLanguage,
  courseLanguages,
  title,
  body,
  onExpand,
  tries,
  triesLimited,
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
      <Typography>Tries are limited: {triesLimited ? "yes" : "no"}</Typography>
      <Typography>Number of tries: {tries}</Typography>
    </Grid>

    <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
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
