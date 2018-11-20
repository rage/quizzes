import {
    Button,
    Collapse,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SvgIcon,
    TextField,
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
import { changeAttr, changeOrder, newQuiz, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'

class QuizForm extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            course: '',
            language: null,
            items: [],
            hide: false
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
                        {this.props.courses.map(course => <MenuItem key={course.id} value={course.id}>{course.id}</MenuItem>) || ""}
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
                                handleOrder={this.handleOrder}
                                key={l.name}
                                language={l.id}
                                hidden={this.state.hide}
                                onSortEnd={this.onSortEnd}
                            />))}
                    </div> :
                    <p />
                }
                <div>
                    <Button onClick={this.hide}>save</Button>
                </div>
            </form>
        )
    }

    private onSortEnd = ({ oldIndex, newIndex }) => {
        console.log(oldIndex, newIndex)
        this.props.changeOrder('items', oldIndex, newIndex)
    }

    private hide = () => {
        this.setState({
            hide: !this.state.hide
        })
    }

    private handleChange = path => event => {
        this.props.changeAttr(path, event.target.value)
    }

    private handleOrder = (path, current) => event => {
        if (event.target.value) {
            this.props.changeOrder(path, current, parseInt(event.target.value, 10))
        }
    }

    private addLanguage = () => {
        console.log("do you want to add language to course blaablaa")
    }

    private handleTabs = (event, value) => {
        this.props.setFilter('language', value)
        /* this.setState({
            language: value
        }) */
    }

    private addItem = () => {
        this.setState({
            items: []
        })
    }

    private selectCourse = (event) => {
        this.setState({
            course: event.target.value
        })
    }

    private selectLanguage = (event) => {
        this.setState({
            language: event.target.value
        })
    }

    private submitQuiz = (event) => {
        event.preventDefault()
        console.log(event.target.title_fi_FI.value)
        console.log(event.target.title_en_US.value)
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
                <Typography variant='subtitle1'>Items</Typography>
                <QuizItems onSortEnd={props.onSortEnd} useDragHandle={true} hidden={props.hidden} quiz={props.quiz} language={props.language} handleChange={props.handleChange} handleOrder={props.handleOrder} />
                <Button>Add item</Button>
            </div>
        </div>
    )
}

const QuizItems = SortableContainer((props: any) => {
    return (
        <ul>
            {props.quiz.items.sort((i1, i2) => i1.order - i2.order).map((item, i) => itemSwitch(item, props.language, props.handleChange, props.handleOrder, i, props.hidden))}
        </ul>
    )
})

const DragHandle = SortableHandle(() => <SvgIcon><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"/></SvgIcon>)

const OpenItem = SortableElement(({ item, language, index, handleChange, handleOrder }: any) => {
    return (
        <ExpansionPanel key={item.id} style={{ marginBottom: 20 }}>
            <ExpansionPanelSummary>
                <div style={{ flexBasis: "5%" }} >
                    <DragHandle />
                </div>
                <div style={{ flexBasis: "70%" }}>
                    <TextField
                        label="title"
                        value={item.texts.find(t => t.languageId === language).title}
                        fullWidth={true}
                        onChange={handleChange(`items[${index}].texts[${item.texts.findIndex(t => t.languageId === language)}].title`)}
                    />
                </div>
                <div style={{ flexBasis: "20%" }} />
                <div style={{ flexBasis: "5%" }}>
                    <p>{item.order}</p>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <TextField
                    label="validity regex"
                    fullWidth={true}
                    value={item.validityRegex}
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})

/*const OpenItem = SortableElement(({ item, language, index, handleChange, handleOrder, hidden }: any) => {
    
    return (
        <Paper style={{ padding: 15, marginBottom: 5 }}>
            <TextField
                label="title"
                value={item.texts.find(t => t.languageId === language).title}
                fullWidth={true}
                onChange={handleChange(`items[${index}].texts[${item.texts.findIndex(t => t.languageId === language)}].title`)}
            />
            <Collapse in={hidden}>
                kissasmossus
            </Collapse>
        </Paper>
    )
})*/

const itemSwitch = (item, language, handleChange, handleOrder, index, hidden) => {

    switch (item.type) {
        case "open":
            return <OpenItem key={item.id} hidden={hidden} item={item} language={language} handleChange={handleChange} index={index} handleOrder={handleOrder} />
        /* return (
            <ExpansionPanel key={item.id} style={{ marginBottom: 20 }}>
                <ExpansionPanelSummary>
                    <div style={{ flexBasis: "75%" }}>
                        <TextField
                            label="title"
                            value={item.texts.find(t => t.languageId === language).title}
                            fullWidth={true}
                            onChange={handleChange(`items[${index}].texts[${item.texts.findIndex(t => t.languageId === language)}].title`)}
                        />
                    </div>
                    <div style={{ flexBasis: "10%" }} />
                    <div style={{ flexBasis: "15%" }}>
                        <TextField
                            fullWidth={true}
                            value={item.order}
                            label="order"
                            type="number"
                            inputProps={{
                                step: 1,
                            }}
                            onChange={handleOrder("items", item.order)}
                        />
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <TextField
                        label="validity regex"
                        fullWidth={true}
                        value={item.validityRegex}
                    />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )*/
        case "essay":
            break
        case "radio":
            break
        case "checkbox":
            break
        case "scale":
            break
        case "research-agreement":
            break
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
    changeAttr,
    changeOrder,
    newQuiz,
    setEdit,
    setFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)