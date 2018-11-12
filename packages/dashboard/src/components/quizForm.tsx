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
import { changeAttr } from '../store/edit/actions'

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

        const TabContainer = (props: any) => {
            console.log(props.kakka)
            return (
                <div>
                    <TextField
                        onChange={this.handleChange(`texts[${props.index}].title`)}
                        label='Title'
                        value={this.props.edit.texts[props.index].title} 
                        margin="normal"
                        fullWidth={true}
                    />
                    <TextField
                        onChange={this.handleChange(`texts[${props.index}].body`)}
                        label='Body'
                        value={this.props.edit.texts[props.index].body}
                        margin="normal"
                        fullWidth={true}
                        multiline={true}
                        rowsMax="10"
                    />
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
                        {this.props.edit.__course__.languages.map((l, i) => (this.state.language === l.id && <TabContainer key={l.name} index={i} kakka={l} />))}
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
        console.log(event.target.title_fi_FI.value)
        console.log(event.target.title_en_US.value)
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
    changeAttr
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)