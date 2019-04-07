import {
  Button,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core"
import { InputProps } from "@material-ui/core/Input"
import React, { Component, createRef } from "react"
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
      menuOpen: false,
      menuAnchor: null,
      scrollTo: null,
      justAdded: false,
      expandList: [],
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
    if (this.state.expandList.toString() === nextState.expandList.toString()) {
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
    this.setState({ justAdded: false })
    return copy.find(i => !i.id)
  }

  public expanded = (isExpanded: boolean, index: number) => {
    if (this.state.expandList.length === 0) {
      const newList: boolean[] = []
      newList[index] = isExpanded
      this.setState({ expandList: newList })
    } else {
      const newList: boolean[] = this.state.expandList
      newList[index] = isExpanded
      this.setState({ expandList: newList })
    }
  }

  public render() {
    return (
      <div>
        <div style={{ marginTop: 0 }}>
          <TextField
            onChange={this.props.handleChange(
              `texts[${this.props.textIndex}].title`,
            )}
            label="title"
            value={this.props.text.title}
            margin="normal"
            fullWidth={true}
            multiline={true}
          />
          <TextField
            onChange={this.props.handleChange(
              `texts[${this.props.textIndex}].body`,
            )}
            label="body"
            value={this.props.text.body}
            margin="normal"
            fullWidth={true}
            multiline={true}
            rowsMax="10"
          />
          {this.props.items.find(item => item.type === "essay") ? (
            <TextField
              onChange={this.props.handleChange(
                `texts[${this.props.submitMessage}].submitMessage`,
              )}
              label="submit message"
              value={this.props.text.submitMessage}
              margin="normal"
              fullWidth={true}
              multiline={true}
              rowsMax="10"
            />
          ) : (
            <p />
          )}
        </div>
        <div style={{ marginTop: 50 }}>
          <Paper style={{ padding: 30, marginBottom: 20 }}>
            <Typography variant="title" style={{ marginBottom: 10 }}>
              Items / Question types:
            </Typography>
            <ItemContainer
              expanded={this.expanded}
              newest={this.newest()}
              onSortEnd={this.onSortEnd}
              items={this.props.items}
              handleChange={this.props.handleChange}
              useDragHandle={true}
              handleSort={this.onSortEnd}
              remove={this.remove}
              scrollToNew={this.scrollToNewItem}
              shouldBeExpandedList={this.state.expandList}
            />

            <Button id="item" onClick={this.handleMenu}>
              Add item
            </Button>
            <Menu
              anchorEl={this.state.menuAnchor}
              open={this.state.menuOpen === "item"}
              onClose={this.handleMenu}
            >
              {this.itemTypes.map(type => (
                <MenuItem key={type} value={type} onClick={this.addItem(type)}>
                  {type}
                </MenuItem>
              ))}
            </Menu>
          </Paper>
          {this.props.items.find(item => item.type === "essay") ? (
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
          ) : (
            <p />
          )}
        </div>
      </div>
    )
  }

  private addItem = type => event => {
    this.setState({
      menuOpen: null,
      justAdded: true,
    })
    this.props.addItem(type)
  }

  private addReview = event => {
    this.setState({
      menuOpen: null,
    })
    this.props.addReview()
  }

  private remove = (path, index) => event => {
    this.props.remove(path, index)
  }

  private handleMenu = event => {
    this.setState({
      menuOpen: event.currentTarget.id,
      menuAnchor: event.currentTarget,
    })
  }

  private onSortEnd = ({ oldIndex, newIndex, collection }) => {
    const newList: boolean[] = { ...this.state.expandList }
    const temp: boolean = newList[newIndex]
    newList[newIndex] = newList[oldIndex]
    newList[oldIndex] = temp
    this.setState({ expandList: newList })
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabContainer)
