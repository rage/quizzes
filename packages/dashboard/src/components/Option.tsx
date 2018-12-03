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
    Typography
} from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'
import DragHandleWrapper from './DragHandleWrapper'

class Option extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    public shouldComponentUpdate(nextProps, nextState) {
        if (nextState.expanded !== this.state.expanded) {
            return true
        }
        if (nextProps.index !== this.props.index) {
            return true
        }
        if (nextProps.correct !== this.props.correct) {
            return true
        }
        if (nextProps.title !== this.props.title) {
            return true
        }
        if (nextProps.body !== this.props.body) {
            return true
        }
        if (nextProps.successMessage !== this.props.successMessage) {
            return true
        }
        if (nextProps.failureMessage !== this.props.failureMessage) {
            return true
        }
        return false
    } 

    public render() {

        // console.log("option")

        return (
            <SortableGridItem index={this.props.index} collection={this.props.collection} size={!this.state.expanded ? 3 : 12}>
                <Card style={{ marginBottom: 20 }}>
                    <DragHandleWrapper>
                        {!this.state.expanded ? <CardHeader
                            title={this.props.title}
                            titleTypographyProps={{ variant: "subtitle1", gutterBottom: false }}
                        /> : ""}
                    </DragHandleWrapper>
                    <CardActions>
                        <Grid container={true} justify="flex-end">
                            <Grid item={true}>
                                <IconButton onClick={this.handleExpand}>
                                    <SvgIcon><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" /></SvgIcon>
                                </IconButton>
                            </Grid>
                        </Grid>
                        
                    </CardActions>
                    {this.state.expanded ?
                        <CardContent>
                            <Card>
                                <CardHeader subheader="general" />
                                <CardContent>
                                    <TextField
                                        label="title"
                                        value={this.props.title || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].title`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="body"
                                        value={this.props.body || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].body`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="success message"
                                        value={this.props.successMessage || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].successMessage`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="failure message"
                                        value={this.props.failureMessage || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].failureMessage`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <Switch
                                        checked={this.props.correct}
                                        value={!this.props.correct}
                                        color="primary"
                                        onChange={this.props.handleChange(`items[${this.props.itemIndex}].options[${this.props.index}].correct`)}
                                    />
                                </CardContent>
                            </Card>
                        </CardContent> : ""}
                </Card>
            </SortableGridItem>
        )
    }

    private handleExpand = (event) => {
        this.setState({ expanded: !this.state.expanded })
    }
}

const SortableGridItem = SortableElement((props: any) => <Grid item={true} xs={props.size}>{props.children}</Grid>)

const mapStateToProps = (state: any) => {
    return {
        courses: state.courses,
        edit: state.edit,
        filter: state.filter,
        quizzes: state.quizzes,
        user: state.user
    }
}

export default connect(mapStateToProps)(Option)