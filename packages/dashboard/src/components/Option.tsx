import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Collapse,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    FormControlLabel,
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
import React from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
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
            <SortableGridItem index={this.props.index} collection={this.props.collection} size={!this.state.expanded ? 12 : 12}>
                <Card>
                    {!this.state.expanded ?
                        <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
                            <Grid item={true} xs={11}>
                                <DragHandleWrapper>
                                    <CardHeader
                                        title={this.props.title}
                                        titleTypographyProps={{ variant: "subtitle1", gutterBottom: false }}
                                    />
                                </DragHandleWrapper>
                            </Grid>
                            <Grid item={true} xs={1} >
                                <Grid container={true} justify="flex-end">
                                    <Grid item={true}>
                                        <CardActions>
                                            <IconButton onClick={this.handleExpand}>
                                                <SvgIcon><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" /></SvgIcon>
                                            </IconButton>
                                        </CardActions>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid> :
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
                                    <Grid container={true} style={{ marginTop: 20 }}>
                                        <Grid item={true} xs={12}>
                                            <Grid container={true} justify="space-between">
                                                <Grid item={true} xs={1}>
                                                    <FormControlLabel
                                                        control={<Checkbox
                                                            checked={this.props.correct}
                                                            onChange={this.props.handleChange(`items[${this.props.itemIndex}].options[${this.props.index}].correct`)}
                                                            color="primary"
                                                        />}
                                                        label="correct"
                                                    />
                                                </Grid>
                                                <Grid item={true} xs={1}>
                                                    <Grid onClick={this.props.remove(`items[${this.props.itemIndex}].options`, this.props.index)} container={true} justify="flex-end">
                                                        <IconButton aria-label="Delete" color="secondary">
                                                            <SvgIcon><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></SvgIcon>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item={true} xs={12} >
                                            <Grid container={true} justify="flex-end">
                                                <Grid item={true}>
                                                    <CardActions>
                                                        <IconButton onClick={this.handleExpand} style={{ transform: 'rotate(180deg)' }}>
                                                            <SvgIcon><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" /></SvgIcon>
                                                        </IconButton>
                                                    </CardActions>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </CardContent>}
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