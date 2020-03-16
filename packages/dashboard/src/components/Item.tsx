import React, { createRef } from "react"
import { connect } from "react-redux"
import { changeOrder, remove } from "../store/edit/actions"
import Checkbox from "./Checkbox"
import CustomType from "./CustomType"
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
  | "custom-frontend-accept-data"

class Item extends React.Component<any, any> {
  private titleRef = createRef<HTMLInputElement>()

  private itemComponents = {
    checkbox: Checkbox,
    "custom-frontend-accept-data": CustomType,
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
}

export default connect(null, { changeOrder, remove })(Item)
