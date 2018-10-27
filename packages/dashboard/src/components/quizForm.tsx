import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
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
            items: []
        }
    }

    public render() {
        return (
            <div>
                <form onSubmit={this.submitQuiz}>
                    <FormControl>
                        <InputLabel>Course</InputLabel>
                        <Select onChange={this.handleSelect} value={this.state.course} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                            {this.props.courses.map(course => <MenuItem key={course} value={course}>{course}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label='Title' name='title' margin="normal" fullWidth={true} />
                    <TextField label='Body' name="body" margin="normal" fullWidth={true} multiline={true} rowsMax="10" />
                    <Button onClick={this.addItem}>Add item</Button>
                    <Button type='submit'>save</Button>
                </form>
            </div>
        )
    }

    private addItem = () => {
        this.setState({
            items: []
        })
    }

    private handleSelect = (event) => {
        this.setState({
            course: event.target.value
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
        filter: state.filter,
        quizzes: state.quizzes,
        user: state.user
    }
}

export default connect(mapStateToProps)(QuizForm)