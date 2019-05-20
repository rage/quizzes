import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
} from "@material-ui/core"
import Delete from "@material-ui/icons/Delete"
import React, { ChangeEvent, createRef } from "react"
import { connect } from "react-redux"
import { executeIfOnlyDigitsInTextField } from "../../../common/src/util/index"
import { changeOrder, remove } from "../store/edit/actions"
import Checkbox from "./Checkbox"
import Essay from "./Essay"
import MultipleChoice from "./MultipleChoice"
import Open from "./Open"
import ResearchAgreement from "./ResearchAgreement"
import Scale from "./Scale"

type itemType =
  | "checkbox"
  | "essay"
  | "multiple-choice"
  | "open"
  | "research-agreement"
  | "scale"

class Item extends React.Component<any, any> {
  private titleRef = createRef<HTMLInputElement>()

  private itemComponents = {
    checkbox: Checkbox,
    essay: Essay,
    "multiple-choice": MultipleChoice,
    open: Open,
    "research-agreement": ResearchAgreement,
    scale: Scale,
  }

  constructor(props) {
    super(props)
    this.state = {
      expandedOptions: {},
    }
  }

  // DISSPLAYNG THE ESSAY: SHOULD BE MORE UNIFORM WITH THE OTHERS!

  public expandOption = (order: number): void => {
    const newExpList: boolean[] = { ...this.state.expandedOptions }
    newExpList[order] = !newExpList[order]
    this.setState({
      expandedOptions: newExpList,
    })
  }

  public componentDidMount() {
    if (this.props.newlyAdded) {
      this.props.scrollToNew(this.titleRef.current)
      this.props.expandItem(this.props.order)
    }
  }

  public shouldComponentUpdate(nextProps, nextState) {
    if (nextState.expandedOptions !== this.state.expandedOptions) {
      return true
    }
    if (nextProps.expanded !== this.props.expanded) {
      return true
    }

    const modificationFields = [
      "title",
      "body",
      "minWords",
      "maxWords",
      "successMessage",
      "failureMessage",
      "validityRegex",
      "formatRegex",
      "newlyAdded",
      "expanded",
      "order",
      "items",
    ]

    return modificationFields.some(
      fieldName => nextProps[fieldName] !== this.props[fieldName],
    )
  }

  public render() {
    const ItemComponent = this.itemComponents[this.props.type]
    return (
      <ItemComponent
        {...this.props}
        onCancel={this.handleItemCancel(this.props.order)}
        toggleExpand={this.toggleExpand}
        onRemoval={this.handleItemRemoval}
      />
    )
  }

  private handleItemRemoval = (path, index) => () => {
    this.props.remove(path, index)
  }

  private handleItemCancel = quizItemOrder => () => {
    this.props.remove("items", quizItemOrder)
  }

  private toggleExpand = event => {
    this.props.expandItem(this.props.order)
  }

  private onOptionSortEnd = ({ oldIndex, newIndex, collection }) => {
    const newExpList = { ...this.state.expandedOptions }
    const temp = newExpList[oldIndex]
    newExpList[oldIndex] = newExpList[newIndex]
    newExpList[newIndex] = temp
    this.setState({
      expandedOptions: newExpList,
    })
    this.props.changeOrder(collection, oldIndex, newIndex)
  }
}

export default connect(
  null,
  { changeOrder, remove },
)(Item)
