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
    Tab,
    Tabs,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { addItem, addOption, addReview, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'
import ItemContainer from './ItemContainer'
import OptionContainer from './OptionContainer'
import PeerReviewQuestionContainer from './PeerReviewQuestionContainer'

class TabContainer extends React.Component<any, any> {

    private itemTypes = [
        "checkbox",
        "essay",
        "open",
        "radio",
        "research-agreement",
        "scale"
    ]

    private reviewTypes = [
        "essay",
        "grade"
    ]

    constructor(props) {
        super(props)
        this.state = {
            menuOpen: false,
            menuAnchor: null
        }
    }

    public render() {
        return (
            <div>
                <div style={{ marginTop: 0 }}>
                    <TextField
                        onChange={this.props.handleChange(`texts[${this.props.textIndex}].title`)}
                        label='title'
                        value={this.props.text.title}
                        margin="normal"
                        fullWidth={true}
                        multiline={true}
                    />
                    <TextField
                        onChange={this.props.handleChange(`texts[${this.props.textIndex}].body`)}
                        label='body'
                        value={this.props.text.body}
                        margin="normal"
                        fullWidth={true}
                        multiline={true}
                        rowsMax="10"
                    />
                </div>
                <div style={{ marginTop: 50 }}>
                    <Typography variant='subtitle1'>Items:</Typography>
                    <ItemContainer
                        onSortEnd={this.onSortEnd}
                        items={this.props.items}
                        handleChange={this.props.handleChange}
                        useDragHandle={true}
                        handleSort={this.onSortEnd}
                    />
                    <Button id="item" onClick={this.handleMenu}>Add item</Button>
                    <Menu anchorEl={this.state.menuAnchor} open={this.state.menuOpen === "item"} onClose={this.handleMenu}>
                        {this.itemTypes.map(type => <MenuItem key={type} value={type} onClick={this.addItem(type)}>{type}</MenuItem>)}
                    </Menu>
                    {this.props.items[0] && this.props.items[0].type === "essay" ?
                        <div>
                            <Typography variant='subtitle1'>Peer review questions:</Typography>
                            <PeerReviewQuestionContainer
                                peerReviewQuestions={this.props.peerReviewQuestions}
                                handleChange={this.props.handleChange}
                                onSortEnd={this.onSortEnd}
                                useDragHandle={true}
                            />
                            <Button id="review" onClick={this.handleMenu}>Add review question</Button>
                            <Menu anchorEl={this.state.menuAnchor} open={this.state.menuOpen === "review"} onClose={this.handleMenu}>
                                {this.reviewTypes.map((type, index) => <MenuItem key={type + index} value={type} onClick={this.addReview(type)}>{type}</MenuItem>)}
                            </Menu>
                        </div> :
                        <p />}
                </div>
            </div>
        )
    }

    private addItem = type => event => {
        this.setState({
            menuOpen: null
        })
        this.props.addItem(type)
    }

    private addReview = type => event => {
        this.setState({
            menuOpen: null
        })
        this.props.addReview(type)
    }

    private handleMenu = (event) => {
        this.setState({
            menuOpen: event.currentTarget.id,
            menuAnchor: event.currentTarget
        })
    }

    private onSortEnd = ({ oldIndex, newIndex, collection }) => {
        this.props.changeOrder(collection, oldIndex, newIndex)
    }
}

const mapDispatchToProps = {
    addItem,
    addReview,
    changeOrder
}

export default connect(null, mapDispatchToProps)(TabContainer)