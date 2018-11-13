import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'
import { connect } from 'react-redux'
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
import { changeAttr, newQuiz, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'

class QuizForm extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            course: '',
            language: null,
            items: []
        }
    }

    public componentDidMount() {
        if (this.props.quiz) {
            console.log('yes')
            this.props.setEdit(this.props.quiz)
        } else {
            console.log('no')
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
                        <Tabs value={this.props.filter.language} onChange={this.handleTabs}>
                            {this.props.edit.course.languages.map(l => <Tab value={l.id} key={l.id} label={l.id} />) || ""}
                            <Tab label="add" onClick={this.addLanguage} />
                        </Tabs>
                        {this.props.edit.course.languages.map((l, i) => (this.props.filter.language === l.id && <TabContainer quiz={this.props.edit} handleChange={this.handleChange} key={l.name} index={i} language={l.id} />))}
                    </div> :
                    <p />
                }
                <div>
                    <Button onClick={this.addItem}>Add item</Button>
                </div>
                <div>
                    <Button type='submit'>save</Button>
                </div>
            </form>
        )
    }

    private handleChange = path => event => {
        this.props.changeAttr(path, event.target.value)
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
    let index = 0
    props.quiz.texts.map((t, i) => {if (t.languageId === props.language) { index = i }})
    return (
        <div>
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
    )
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
    newQuiz,
    setEdit,
    setFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)