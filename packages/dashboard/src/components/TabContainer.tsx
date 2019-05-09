import {
  Button,
  Grid,
  Grow,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import React, { Component } from "react"
import { connect } from "react-redux"
import { addItem, addReview, changeOrder, remove } from "../store/edit/actions"
import ItemContainer from "./ItemContainer"
import PeerReviewCollectionContainer from "./PeerReviewCollectionContainer"

class TabContainer extends Component<any, any> {
  private itemTypes = [
    "checkbox",
    "essay",
    "feedback",
    "open",
    "multiple-choice",
    "research-agreement",
    "scale",
  ]

  private reviewTypes = ["essay", "grade"]

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

    if (
      this.state.menuOpen !== nextState.menuOpen ||
      (this.state.menuAnchor && nextState.menuAnchor)
    ) {
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
    newExp[index] = newExp[index] ? !newExp[index] : true
    this.setState({ expandedItems: newExp })
  }

  public render() {
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
}

const mapStateToProps = (state: any) => {
  return {
    storeItems: state.edit.items,
  }
}

const mapDispatchToProps = {
  addItem,
  addReview,
  changeOrder,
  remove,
}

class QuestionAdder extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
    }
  }

  public render() {
    return (
      <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
        <Grid container={true} justify="flex-start" alignContent="stretch">
          <Grid
            item={true}
            xs="auto"
            onClick={this.toggleExpand}
            style={{
              backgroundColor: "darkgray",
              cursor: "pointer",
              width: "5em",
            }}
          >
            <Grid
              container={true}
              direction="column"
              justify="center"
              alignContent="center"
              style={{ height: "100%" }}
            >
              <Grid item={true} xs={6}>
                <Add
                  fontSize="large"
                  style={{ color: "white", width: "100%", height: "100%" }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grow in={this.state.expanded} style={{ transformOrigin: "0 0 0" }}>
            <Grid item={true} xs={10} lg={8} style={{ alignSelf: "center" }}>
              <Grid
                container={true}
                justify="flex-start"
                alignItems="center"
                alignContent="center"
                style={{ backgroundColor: "lightgray" }}
              >
                {this.props.itemTypes.map((type, idx) => (
                  <Grid item={true} xs="auto" key={type} style={{}}>
                    <Grid
                      container={true}
                      alignContent="center"
                      alignItems="center"
                    >
                      <Grid item={true} xs={11}>
                        <Button
                          disabled={!this.state.expanded}
                          style={{
                            textTransform: "none",
                            padding: "1em",
                            whiteSpace: "pre-wrap",
                            height: "5em",
                          }}
                          onClick={this.props.addItem(type)}
                        >
                          {type.replace("-", "\n")}
                        </Button>
                      </Grid>
                      {idx < this.props.itemTypes.length - 1 && (
                        <Grid item={true} xs={1}>
                          <Typography
                            align="center"
                            variant="h3"
                            style={{ display: "inline", color: "silver" }}
                          >
                            |
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grow>

          {!this.props.itemsExist && !this.state.expanded && (
            <Grid
              item={true}
              xs={10}
              sm={8}
              md={6}
              lg={4}
              xl={3}
              style={{
                alignSelf: "center",
              }}
            >
              <Typography variant="body1" style={{ color: "darkgray" }}>
                Your Quiz does not have any questions yet. Add a question by
                clicking the button on the left.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    )
  }

  private toggleExpand = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabContainer)
