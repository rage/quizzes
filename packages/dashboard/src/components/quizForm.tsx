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

class QuizForm extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            course: '',
            language: null,
            items: []
        }
    }

    public render() {

        /* if (!this.props.edit.__course__) {
            return <p>loading</p>
        } */

        const TabContainer = () => {
            const quizText = this.props.edit.texts.find(t => t.languageId === this.state.language) || this.props.edit.texts[0]
            return (
                <div>
                    <TextField label='Title' name='title' value={quizText.title} margin="normal" fullWidth={true} />
                    <TextField label='Body' name="body" value={quizText.body} margin="normal" fullWidth={true} multiline={true} rowsMax="10" />
                </div>
            )
        }

        return (
            <form onSubmit={this.submitQuiz}>
                <FormControl>
                    <InputLabel>Course</InputLabel>
                    <Select onChange={this.selectCourse} value={this.props.edit.__course__.id || ""} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                        {this.props.courses.map(course => <MenuItem key={course.id} value={course.id}>{course.id}</MenuItem>) || ""}
                    </Select>
                </FormControl>
                {this.props.edit.__course__.languages ?
                    <div>
                        <Tabs value={this.state.language || this.props.edit.__course__.languages[0].id} onChange={this.handleTabs}>
                            {this.props.edit.__course__.languages.map(l => <Tab value={l.id} key={l.id} label={l.id} />) || ""}
                            <Tab label="add" onClick={this.addLanguage} />
                        </Tabs>
                        <TabContainer />
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

    private addLanguage = () => {
        console.log("do you want to add language to course blaablaa")
    }

    private handleTabs = (event, value) => {
        this.setState({
            language: value
        })
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
        const quiz = {
            course: event.target.course.value

        }
        console.log(event.target.course.value)
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

export default connect(mapStateToProps)(QuizForm)