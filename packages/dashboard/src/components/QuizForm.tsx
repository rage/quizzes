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
import { Redirect } from 'react-router-dom'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter, setLanguage } from '../store/filter/actions'
import ItemContainer from './ItemContainer'
import OptionContainer from './OptionContainer'
import TabContainer from './TabContainer'

class QuizForm extends React.Component<any, any> {

    private itemTypes = [
        "checkbox",
        "essay",
        "open",
        "radio",
        "research-agreement",
        "scale"
    ]

    constructor(props) {
        super(props)
        this.state = {
            menuOpen: null,
            new: true
        }
    }

    public componentDidMount() {
        if (this.props.quiz) {
            this.props.setEdit(this.props.quiz)
        } else {
            this.props.newQuiz()
        }
    } 

    public render() {

        /* if (this.props.new && this.props.edit.id) {
            return <Redirect to={`/quizzes/${this.props.edit.id}`} />
        } */

        return (
            <div>
                <Tabs value={this.props.filter.language || "add"} onChange={this.handleTabs} style={{ marginBottom: 30 }}>
                    {this.props.edit.course.languages.map(l => <Tab value={l.id} key={l.id} label={l.id} />)}
                    <Tab label="add" value="add" onClick={this.addLanguage} />
                </Tabs>
                <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
                    <Grid item={true} xs={12}>
                        <FormControl>
                            <InputLabel>course</InputLabel>
                            <Select onChange={this.selectCourse} value={this.props.edit.course.id || this.props.filter.course} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                                {this.props.courses.map(course => <MenuItem key={course.id} value={course.id}>{course.texts[0].title}</MenuItem>) || ""}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item={true} xs={12}>
                        <TextField label="part" value={this.props.edit.part} type="number" onChange={this.handleChange("part")} />
                    </Grid>
                    <Grid item={true} xs={12}>
                        <TextField label="section" value={this.props.edit.section} type="number" onChange={this.handleChange("section")} />
                    </Grid>
                </Grid>
                {this.props.edit.course.languages.map((l, i) => (
                    this.props.filter.language === l.id &&
                    <TabContainer
                        quiz={this.props.edit}
                        handleChange={this.handleChange}
                        key={l.name}
                        language={l.id}
                        onSortEnd={this.onSortEnd}
                        addItem={this.props.addItem}
                        addOption={this.addOption}
                    />
                ))}
                <Button id="menu" onClick={this.handleMenu}>Add item</Button>
                <Menu anchorEl={this.state.menuOpen} open={Boolean(this.state.menuOpen)} onClose={this.handleMenu}>
                    {this.itemTypes.map(type => <MenuItem key={type} value={type} onClick={this.addItem(type)}>{type}</MenuItem>)}
                </Menu>
                <Toolbar>
                    <Typography style={{ flex: 1 }} />
                    <Button onClick={this.props.save}>save</Button>
                </Toolbar>
            </div>
        )
    }

    private addOption = item => event => {
        this.props.addOption(item)
    }

    private addItem = type => event => {
        this.setState({
            menuOpen: null
        })
        this.props.addItem(type)
    }

    private handleMenu = (event) => {
        this.setState({
            menuOpen: this.state.menuOpen ? null : event.currentTarget
        })
    }

    private onSortEnd = ({ oldIndex, newIndex, collection }) => {
        this.props.changeOrder(collection, oldIndex, newIndex)
    }

    private handleChange = path => event => {
        this.props.changeAttr(path, path.endsWith('correct') ? event.target.checked : event.target.value)
    }

    private addLanguage = () => {
        console.log("do you want to add language to course blaablaa")
    }

    private handleTabs = (event, value) => {
        this.props.setLanguage(value)
    }

    private selectCourse = (event) => {
        console.log(event.target.value)
    }
}

const mapStateToProps = (state: any) => {
    return {
        courses: state.courses,
        edit: state.edit,
        filter: state.filter,
        quizzes: state.quizzes,
        user: state.user
    }
}

const mapDispatchToProps = {
    addItem,
    addOption,
    changeAttr,
    changeOrder,
    newQuiz,
    save,
    setEdit,
    setFilter,
    setLanguage
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)

