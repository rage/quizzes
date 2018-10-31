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
            language: '',
            items: []
        }
    }

    public render() {

        console.log(this.state.course)
        console.log(this.state.language)

        const lSet = new Set()
        this.props.courses.map(c => c.course.languages.map(l => lSet.add(l.languageId)))
        const languages = Array.from(lSet)

        const old = () => {
            return (
                <form onSubmit={this.submitQuiz}>
                    <FormControl>
                        <InputLabel>Course</InputLabel>
                        <Select onChange={this.selectCourse} value={this.state.course} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                            {this.props.courses.map(course => <MenuItem key={course} value={course}>{course}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label='Title' name='title' margin="normal" fullWidth={true} />
                    <TextField label='Body' name="body" margin="normal" fullWidth={true} multiline={true} rowsMax="10" />
                    <Button onClick={this.addItem}>Add item</Button>
                    <Button type='submit'>save</Button>
                </form>
            )
        }

        const sketch = () => {
            return (
              <form >
                  <FormControl fullWidth={true}>
                        <InputLabel>Course</InputLabel>
                        <Select onChange={this.selectCourse} value={this.state.course} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                            {this.props.courses.map(course => <MenuItem key={course} value={course}>{course}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth={true}>
                        <InputLabel>Language</InputLabel>
                        <Select onChange={this.selectLanguage} value={this.state.language} inputProps={{ name: 'language' }} style={{ minWidth: 350 }}>
                            {this.props.edit.texts.map(t => <MenuItem key={t.languageId}>{t.languageId}</MenuItem>)}
                        </Select>
                    </FormControl>
              </form>  
            )
        }

        return (
            <div>
                {old()}
            </div>
        )
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