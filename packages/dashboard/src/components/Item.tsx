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
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'
import DragHandleWrapper from './DragHandleWrapper'
import OptionContainer from './OptionContainer'

class Item extends React.Component<any, any> {

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

        // console.log("item")

        const renderOptions = type => {
            return ["radio", "checkbox", "research-agreement"].includes(type)
        }

        return (
            <Card style={{ marginBottom: 20 }}>
                <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
                    <Grid item={true} xs={11}>
                        <DragHandleWrapper>
                            {!this.state.expanded ?
                                <CardHeader
                                    title={this.props.title}
                                    titleTypographyProps={{ variant: "subtitle1", gutterBottom: false }}
                                /> : ""}
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
                </Grid>
                <Collapse in={this.state.expanded}>
                    <CardContent>
                        <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
                            <Grid item={true} xs={12}>
                                <Card>
                                    <CardHeader subheader="general" />
                                    <CardContent>
                                        <TextField
                                            label="title"
                                            value={this.props.title || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.index}].texts[${this.props.textIndex}].title`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="body"
                                            value={this.props.body || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.index}].texts[${this.props.textIndex}].body`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="success message"
                                            value={this.props.successMessage || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.index}].texts[${this.props.textIndex}].successMessage`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="failure message"
                                            value={this.props.failureMessage || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.index}].texts[${this.props.textIndex}].failureMessage`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        {this.props.type === "open" ?
                                            <div>
                                                <TextField
                                                    label="validity regex"
                                                    fullWidth={true}
                                                    value={this.props.validityRegex || undefined}
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="format regex"
                                                    fullWidth={true}
                                                    value={this.props.formatRegex || undefined}
                                                    margin="normal"
                                                />
                                            </div> :
                                            <p />}
                                    </CardContent>
                                </Card>
                            </Grid>
                            {renderOptions(this.props.type) ?
                                <Grid item={true} xs={12}>
                                    <Card>
                                        <CardHeader subheader="options" />
                                        <CardContent>
                                            <OptionContainer
                                                axis="xy"
                                                onSortEnd={this.props.handleSort}
                                                index={this.props.index}
                                                useDragHandle={true}
                                                language={this.props.language}
                                                handleChange={this.props.handleChange}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid> :
                                <p />}
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }

    private handleExpand = (event) => {
        this.setState({ expanded: !this.state.expanded })
    }
}

export default connect()(Item)