import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  SvgIcon,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import React from "react"
import { connect } from "react-redux"
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc"
import {
  addFinishedOption,
  addItem,
  addOption,
  changeAttr,
  changeOrder,
  newQuiz,
  save,
  setEdit,
} from "../store/edit/actions"
import Option from "./Option"
import OptionDialog from "./OptionDialog"

class Options extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      open: false,
    }
  }

  public render() {
    const options = this.props.edit.items[this.props.index].options
    return (
      <Grid container={true} spacing={16}>
        {options
          .sort((o1, o2) => o1.order - o2.order)
          .map((option, index) => {
            const text = option.texts.find(
              t => t.languageId === this.props.language,
            )
            return (
              <Option
                handleChange={this.props.handleChange}
                key={option.id || this.props.index + index}
                index={index}
                collection={`items[${this.props.index}].options`}
                itemIndex={this.props.index}
                textIndex={option.texts.findIndex(
                  t => t.languageId === this.props.language,
                )}
                correct={option.correct}
                title={text.title}
                body={text.body}
                successMessage={text.successMessage}
                failureMessage={text.failureMessage}
                remove={this.props.remove}
                expanded={this.props.expandedOptions[index]}
                expansionChange={this.props.expansionChange}
              />
            )
          })}
        <Grid item={true} xs={3}>
          <Paper style={{ padding: 5, marginBottom: 5 }}>
            <Button onClick={this.setOpen(true)}>add option</Button>
            <OptionDialog
              onSubmit={this.handleSubmission(this.props.index)}
              isOpen={this.state.open}
              onClose={this.setOpen(false)}
            />
          </Paper>
        </Grid>
      </Grid>
    )
  }

  private handleSubmission = item => optionData => event => {
    this.props.addFinishedOption(item, optionData)
  }

  private setOpen = (newValue: boolean) => () => {
    this.setState({ open: newValue })
  }
}

const OptionContainer = SortableContainer(Options)

const mapStateToProps = state => {
  return {
    edit: state.edit,
  }
}

const mapDispatchToProps = {
  addOption,
  addFinishedOption,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OptionContainer)
