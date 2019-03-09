import React from 'react'
import { TextField, Typography, Paper } from '@material-ui/core'




const Open = ({
    answered,
    correct,
    handleTextDataChange,
    languageId,
    textData,
    successMessage,
    failureMessage
}) => {


    // defaults to English
    let languageInfo = ((languageId) => {
        const languageOptions = {
            en_US: {
                placeholder: "Answer", 
                userAnswerLabel: "Your answer"
            }, 

            fi_FI: {
                placeholder: "Vastaus",
                userAnswerLabel: "Vastauksesi"
            }
        }
        
        const result = languageOptions[languageId]
        return result !== undefined
                ? result
                : languageOptions.en_US            
        })(languageId)

    if(answered){
        return (
            <div>
                <Typography variant="subtitle1">{languageInfo.userAnswerLabel}:</Typography>
                <Paper style={paper}>
                    <Typography variant="body1">{ textData }</Typography>
                </Paper>
                <Paper style={answerStyle(correct)} >
                    <Typography variant="body1">
                    { correct ? 
                    successMessage : 
                    failureMessage }
                    </Typography>
                </Paper>
            </div>
        )
    }
    


    return (
        <div>
            <TextField 
            value={textData}
            onChange={handleTextDataChange}
            fullWidth
            margin="normal"
            placeholder={languageInfo.placeholder}
            />
        </div>
    )
}


const answerStyle = (correct) => ({  
    ...paper,
    borderLeft: `1em solid ${correct ? "green" : "red"}`
    
})


const paper = {
    padding: 10,
    margin: 10
}


export default Open