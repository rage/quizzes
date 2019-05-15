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
import TogglableQuizInstruction from "./TogglableQuizInstruction"

const ShortQuizInfo = ({
  filterLanguage,
  courseLanguages,
  title,
  body,
  onExpand,
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
