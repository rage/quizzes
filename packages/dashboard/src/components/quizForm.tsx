import {
    Button,
    Collapse,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
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
import {
    INewPeerReviewQuestion,
    INewPeerReviewQuestionTranslation,
    INewQuizItem,
    INewQuizItemTranslation,
    INewQuizOption,
    INewQuizOptionTranslation,
    INewQuizQuery,
    INewQuizTranslation
} from '../../../common/src/types/index'
import { addItem, changeAttr, changeOrder, newQuiz, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'

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
            menuOpen: null
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
        return (
            <form onSubmit={this.submitQuiz}>
                <FormControl>
                    <InputLabel>Course</InputLabel>
                    <Select onChange={this.selectCourse} value={this.props.edit.course.id || this.props.filter.course} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                        {this.props.courses.map(course => <MenuItem key={course.id} value={course.id}>{course.texts[0].title}</MenuItem>) || ""}
                    </Select>
                </FormControl>
                {this.props.edit.course.languages ?
                    <div>
                        <Tabs value={this.props.filter.language} onChange={this.handleTabs} style={{ marginTop: 50 }}>
                            {this.props.edit.course.languages.map(l => <Tab value={l.id} key={l.id} label={l.id} />) || ""}
                            <Tab label="add" onClick={this.addLanguage} />
                        </Tabs>
                        {this.props.edit.course.languages.map((l, i) => (
                            this.props.filter.language === l.id && <TabContainer
                                quiz={this.props.edit}
                                handleChange={this.handleChange}
                                key={l.name}
                                language={l.id}
                                onSortEnd={this.onSortEnd}
                                addItem={this.props.addItem}
                            />))}
                    </div> :
                    <p />
                }
                <Button id="menu" onClick={this.handleMenu}>Add item</Button>
                <Menu anchorEl={this.state.menuOpen} open={Boolean(this.state.menuOpen)} onClose={this.handleMenu}>
                    {this.itemTypes.map(type => <MenuItem key={type} onClick={this.addItem(type)}>{type}</MenuItem>)}
                </Menu>
                <Toolbar>
                    <Typography style={{ flex: 1 }} />
                    <Button >save</Button>
                </Toolbar>
            </form>
        )
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
        this.props.changeAttr(path, event.target.value)
    }

    private addLanguage = () => {
        console.log("do you want to add language to course blaablaa")
    }

    private handleTabs = (event, value) => {
        this.props.setFilter('language', value)
    }

    private selectCourse = (event) => {
        console.log(event.target.value)
    }

    private submitQuiz = (event) => {
        event.preventDefault()
        console.log(event.target.title_fi_FI.value)
        console.log(event.target.title_en_US.value)
    }
}

class TabContainer2 extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            menuOpen: null
        }
    }

    public render() {

        const index = this.props.quiz.texts.findIndex(t => t.languageId === this.props.language)

        return (
            <div>
                <div style={{ marginTop: 50 }}>
                    <TextField
                        onChange={this.props.handleChange(`texts[${index}].title`)}
                        label='Title'
                        value={this.props.quiz.texts[index].title}
                        margin="normal"
                        fullWidth={true}
                        multiline={true}
                    />
                    <TextField
                        onChange={this.props.handleChange(`texts[${index}].body`)}
                        label='Body'
                        value={this.props.quiz.texts[index].body}
                        margin="normal"
                        fullWidth={true}
                        multiline={true}
                        rowsMax="10"
                    />
                </div>
                <div style={{ marginTop: 50 }}>
                    <Typography variant='subtitle1'>Items:</Typography>
                    <ItemContainer
                        onSortEnd={this.props.onSortEnd}
                        useDragHandle={true}
                        hidden={this.props.hidden}
                        quiz={this.props.quiz}
                        language={this.props.language}
                        handleChange={this.props.handleChange}
                        handleSort={this.props.onSortEnd}
                        addItem={this.props.addItem}
                    />
                    <Button id="menu" onClick={this.handleMenu}>Add item</Button>
                    <Menu anchorEl={this.state.menuOpen} open={Boolean(this.state.menuOpen)} onClose={this.handleMenu}>
                        <MenuItem onClick={this.addItem("open")}>open</MenuItem>
                    </Menu>
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

    private handleMenu = (event) => {
        this.setState({
            menuOpen: this.state.menuOpen ? null : event.currentTarget
        })
    }
}

const TabContainer = (props: any) => {
    const index = props.quiz.texts.findIndex(t => t.languageId === props.language)
    return (
        <div>
            <div style={{ marginTop: 50 }}>
                <TextField
                    onChange={props.handleChange(`texts[${index}].title`)}
                    label='Title'
                    value={props.quiz.texts[index].title}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                />
                <TextField
                    onChange={props.handleChange(`texts[${index}].body`)}
                    label='Body'
                    value={props.quiz.texts[index].body}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                    rowsMax="10"
                />
            </div>
            <div style={{ marginTop: 50 }}>
                <Typography variant='subtitle1'>Items:</Typography>
                <ItemContainer
                    onSortEnd={props.onSortEnd}
                    useDragHandle={true}
                    hidden={props.hidden}
                    quiz={props.quiz}
                    language={props.language}
                    handleChange={props.handleChange}
                    handleSort={props.onSortEnd}
                    addItem={props.addItem}
                />
            </div>
        </div>
    )
}

const ItemContainer = SortableContainer((props: any) => {
    return (
        <div>
            {props.quiz.items.sort((i1, i2) => i1.order - i2.order).map((item, i) =>
                <ItemSwitch
                    key={item.id || item.type + i}
                    item={item}
                    language={props.language}
                    handleChange={props.handleChange}
                    index={i}
                    handleSort={props.handleSort}
                />)}
        </div>
    )
})

const ItemSwitch = ({ item, language, handleChange, index, handleSort }: any) => {
    // console.log(item.type)
    switch (item.type) {
        case "open":
            return (
                <OpenItem
                    collection="items"
                    item={item}
                    language={language}
                    handleChange={handleChange}
                    index={index}
                />
            )
        case "essay":
            break
        case "radio":
            return (
                <RadioItem
                    handleSort={handleSort}
                    collection="items"
                    item={item}
                    language={language}
                    handleChange={handleChange}
                    index={index}
                />
            )
        case "checkbox":
            return (
                <RadioItem
                    handleSort={handleSort}
                    collection="items"
                    item={item}
                    language={language}
                    handleChange={handleChange}
                    index={index}
                />
            )
        case "scale":
            break
        case "research-agreement":
            break
    }
    return <p />
}

const OpenItem = SortableElement((props: any) => {
    return (
        <ExpansionPanel style={{ marginBottom: 20 }}>
            <ExpansionPanelSummary>
                <div style={{ flexBasis: "5%" }} >
                    <DragHandle />
                </div>
                <div style={{ flexBasis: "70%" }}>
                    <TextField
                        label="title"
                        value={props.item.texts.find(t => t.languageId === props.language).title}
                        fullWidth={true}
                        onChange={props.handleChange(`items[${props.item.order}].texts[${props.item.texts.findIndex(t => t.languageId === props.language)}].title`)}
                        multiline={true}
                    />
                </div>
                <div style={{ flexBasis: "20%" }} />
                <div style={{ flexBasis: "5%" }}>
                    <p>{props.item.order}</p>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <TextField
                    label="validity regex"
                    fullWidth={true}
                    value={props.item.validityRegex}
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})

const RadioItem = SortableElement((props: any) => {
    return (
        <ExpansionPanel style={{ marginBottom: 20 }}>
            <ExpansionPanelSummary>
                <div style={{ flexBasis: "5%" }} >
                    <DragHandle />
                </div>
                <div style={{ flexBasis: "70%" }}>
                    <TextField
                        label="title"
                        value={props.item.texts.find(t => t.languageId === props.language).title}
                        fullWidth={true}
                        onChange={props.handleChange(`items[${props.item.order}].texts[${props.item.texts.findIndex(t => t.languageId === props.language)}].title`)}
                        multiline={true}
                    />
                </div>
                <div style={{ flexBasis: "20%" }} />
                <div style={{ flexBasis: "5%" }}>
                    <p>{props.item.order}</p>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <OptionContainer onSortEnd={props.handleSort} options={props.item.options} itemOrder={props.item.order} useDragHandle={true} />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})

const OptionContainer = SortableContainer((props: any) => {
    return (
        <div>
            {props.options.sort((o1, o2) => o1.order - o2.order).map((option, index) => <Option collection={`items[${props.itemOrder}].options`} option={option} index={index} key={option.id} />)}
        </div>
    )
})

const Option = SortableElement((props: any) => {
    return (
        <Paper style={{ padding: 5, marginBottom: 5 }}>
            <DragHandle />
            <TextField value={props.option.texts[0].title} multiline={true} fullWidth={true} />
            <Switch checked={props.option.correct} color="primary" />
        </Paper>
    )
})

const DragHandle = SortableHandle(() => <SvgIcon><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" /></SvgIcon>)

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
    changeAttr,
    changeOrder,
    newQuiz,
    setEdit,
    setFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)