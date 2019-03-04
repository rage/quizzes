import React from "react"
import LikertScale from 'likert-react'
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core"
import 'likert-react/dist/main.css'

export default (props) => {
    if (props.answered && props.answersToReview.length === 0) {
        props.fetchAnswersToReview()
    }
    let answersToReview = props.answersToReview
    if (props.peerReview) {
        answersToReview = answersToReview.filter(answer => answer.id === props.peerReview.quizAnswerId)
        console.log(props.peerReview)
    }
    const peerReview = props.peerReview
    return (
        props.answered
            ?
            <div>
                <Typography variant="subtitle1" >You answered</Typography>
                <Paper style={paper} >
                    <Typography variant="body1" >{props.textData}</Typography>
                </Paper>
                <Typography variant="subtitle1" >Select one to peer review</Typography>
                {answersToReview.map(answer =>
                    <div key={answer.id} >
                        <Paper style={paper} >
                            <Typography variant="body1" >{answer.itemAnswers[0].textData}</Typography>
                        </Paper>
                        {peerReview
                            ? <div>
                                {props.peerReviewQuestions[0].questions.map(question => {
                                    return <LikertScale
                                        key={question.id}
                                        reviews={[{ question: question.texts[0].title }]}
                                        onClick={props.handlePeerReviewGradeChange(question.id)}
                                    />
                                })}
                                <Button
                                    disabled={peerReview.answers.find(answer => !answer.hasOwnProperty("value")) ? true : false}
                                    onClick={props.submitPeerReview}
                                >Submit</Button>
                            </div>
                            : <Grid container >
                                <Grid item xs={3}>
                                    <Button onClick={props.flagAsSpam(answer.id)}>Mark as spam</Button>
                                </Grid>
                                <Grid item xs={8}></Grid>
                                <Grid item xs={1}>
                                    <Button onClick={props.selectAnswer(answer.id)}>Select</Button>
                                </Grid>
                            </Grid>
                        }
                    </div>
                )}
            </div>
            :
            <div>
                <TextField
                    value={props.textData}
                    onChange={props.handleEssayFieldChange}
                    fullWidth={true}
                    multiline={true}
                    margin="normal"
                />
            </div>
    )
}

const paper = {
    padding: 10,
    margin: 10
}
