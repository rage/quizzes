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

class PeerReviewQuestion extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    /*public shouldComponentUpdate(nextProps, nextState) {
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
    }*/

    public render() {

        // console.log("peer")

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
                                            onChange={this.props.handleChange(`peerReviewQuestions[${this.props.index}].texts[${this.props.textIndex}].title`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="body"
                                            value={this.props.body || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`peerReviewQuestions[${this.props.index}].texts[${this.props.textIndex}].body`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <FormControlLabel
                                            value={this.props.default}
                                            control={<Checkbox
                                                checked={this.props.default}
                                                onChange={this.props.handleChange(`peerReviewQuestions[${this.props.index}].default`)}
                                                value={this.props.default}
                                                color="primary"
                                            />}
                                            label="default"
                                            labelPlacement="start"
                                        />
                                        <FormControlLabel
                                            value={this.props.answerRequired}
                                            control={<Checkbox
                                                checked={this.props.answerRequired}
                                                onChange={this.props.handleChange(`peerReviewQuestions[${this.props.index}].answerRequired`)}
                                                value={this.props.answerRequired}
                                                color="primary"
                                            />}
                                            label="answer required"
                                            labelPlacement="start"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
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

export default connect()(PeerReviewQuestion)