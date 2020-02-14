import { Button, Grid, Paper, Typography } from "@material-ui/core"
import React, { Component } from "react"
import { connect } from "react-redux"
import { Prompt } from "react-router-dom"
import { IPeerReviewCollection, IQuizItem } from "../interfaces"
import { addItem, addReview, changeOrder, remove } from "../store/edit/actions"
import ItemContainer from "./ItemContainer"
import PeerReviewCollectionContainer from "./PeerReviewCollectionContainer"
import QuestionAdder from "./QuizQuestionAdder"
import { quizContentsDiffer } from "./tools"

interface ITabContainerProps {
  items: IQuizItem[]
  peerReviewCollections: IPeerReviewCollection[]
}

interface ITabContainerState {
  scrollTo: HTMLInputElement | null
  justAdded: boolean
  expandedItems: { [n: number]: any }
}

class TabContainer extends Component<any, ITabContainerState> {
  private itemTypes = [
    { label: "checkbox", value: "checkbox" },
    { label: "essay", value: "essay" },
    { label: "feedback", value: "feedback" },
    { label: "open", value: "open" },
    { label: "multiple choice", value: "multiple-choice" },
    { label: "research agreement", value: "research-agreement" },
    { label: "scale", value: "scale" },
    { label: "custom front", value: "custom-frontend-accept-data" },
  ]

  constructor(props) {
    super(props)
    this.state = {
      scrollTo: null,
      justAdded: false,
      expandedItems: {},
    }
  }

  public scrollToNewItem = (itemComponent: HTMLInputElement) => {
    if (!itemComponent) {
      return
    }
    this.setState({
      scrollTo: itemComponent,
    })
  }

  public componentDidUpdate() {
    if (this.state.scrollTo) {
      this.state.scrollTo.select()
      this.setState({ scrollTo: null })
    }
  }

  public shouldComponentUpdate(nextProps, nextState) {
    if (this.state.scrollTo) {
      return true
    }

    if (
      JSON.stringify(this.state.expandedItems) !==
      JSON.stringify(nextState.expandedItems)
    ) {
      return true
    }

    if (this.props.items !== nextProps.items) {
      return true
    }

    return this.props !== nextProps
  }

  public newest() {
    if (!this.state.justAdded) {
      return undefined
    }
    const copy = JSON.parse(JSON.stringify(this.props.items))
    copy.sort((i1, i2) => i2.order - i1.order)
    // this.setState({ justAdded: false })
    return copy.find(i => !i.id)
  }

  public expandItem = (index: number) => {
    if (typeof index !== "number") {
      return
    }
    const newExp = { ...this.state.expandedItems }
    if (typeof newExp[index] === "boolean") {
      newExp[index] = !newExp[index]
    } else {
      newExp[index] = true
    }
    this.setState({ expandedItems: newExp })
  }

  public render() {
    const unsaved = this.quizHasUnsavedChanges()
    console.log("Rendering! Unsaved changes: ", unsaved)
    return (
      <Grid container={true} spacing={8} justify="center">
        <Grid
          item={true}
          xs={12}
          sm={10}
          md={6}
          style={{ textAlign: "center" }}
        >
          <Typography variant="h4" style={{ textDecoration: "underline" }}>
            Questions
          </Typography>
        </Grid>

        <Prompt
          when={unsaved}
          message="There are unsaved changes on the page. Are you sure you wish to exit?"
        />

        <Grid item={true} xs={12}>
          <ItemContainer
            expandItem={this.expandItem}
            newest={this.newest()}
            onSortEnd={this.onSortEnd}
            items={this.props.items}
            handleChange={this.props.handleChange}
            useDragHandle={true}
            handleSort={this.onSortEnd}
            remove={this.remove}
            scrollToNew={this.scrollToNewItem}
            expandedItems={this.state.expandedItems}
          />
        </Grid>

        <QuestionAdder
          itemTypes={this.itemTypes}
          addItem={this.addItem}
          itemsExist={this.props.items && this.props.items.length > 0}
        />

        {this.props.items.find(item => item.type === "essay") && (
          <Grid item={true} xs={12}>
            <Paper style={{ padding: 30 }}>
              <Typography variant="title" style={{ marginBottom: 10 }}>
                Peer reviews:
              </Typography>
              <PeerReviewCollectionContainer
                peerReviewCollections={this.props.peerReviewCollections}
                handleChange={this.props.handleChange}
                handleSort={this.onSortEnd}
                useDragHandle={true}
                remove={this.remove}
              />
              <Button id="review" onClick={this.addReview}>
                Add review
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    )
  }

  private addItem = type => event => {
    this.setState({
      justAdded: true,
    })
    this.props.addItem(type)
  }

  private addReview = event => {
    this.props.addReview()
  }

  private remove = (path, index) => event => {
    /* // This is called to remove review question
    // w/ `peerReviewCollections[${
      this.props.collectionIndex
    }].questions`,
    this.props.index,
    */

    this.props.remove(path, index)
  }

  private onSortEnd = ({ oldIndex, newIndex, collection }) => {
    if (collection === "items") {
      const newExp = { ...this.state.expandedItems }
      const temp: boolean = newExp[oldIndex]
      newExp[oldIndex] = newExp[newIndex]
      newExp[newIndex] = temp
      this.setState({ expandedItems: newExp })
    }

    this.props.changeOrder(collection, oldIndex, newIndex)
  }

  private quizHasUnsavedChanges = (): boolean => {
    if (this.props.justAdded) {
      return true
    }

    const savedQuizInfo = this.props.courseInfos
      .find(ci => ci.courseId === this.props.filter.course)
      .quizzes.find(q => q.id === this.props.filter.quiz)

    const editInfo = this.props.edit

    return quizContentsDiffer(editInfo, savedQuizInfo)
  }
}

const mapStateToProps = (state: any) => {
  return {
    items: state.edit.items,
    peerReviewCollections: state.edit.peerReviewCollections,
    edit: state.edit,
    courseInfos: state.quizzes.courseInfos,
    filter: state.filter,
  }
}

const mapDispatchToProps = {
  addItem,
  addReview,
  changeOrder,
  remove,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabContainer)
