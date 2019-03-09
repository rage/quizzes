import React from 'react'
import { TextField, Typography, Paper } from '@material-ui/core'



const fieldInstruction = (languageId) => {
    const instructionOptions = {
        en_US: "Answer...",
        fi_FI: "Vastaus..."
    }
    return instructionOptions[languageId] !== undefined ? 
            instructionOptions[languageId]
            : "..."
}


const Open = ({
    answered,
    correct,
    handleTextDataChange,
    languageId,
    textData,
    successMessage,
    failureMessage
}) => {



    if(answered){
        return (
            <div>
                <Typography variant="subtitle1">Vastasit</Typography>
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
            placeholder={fieldInstruction(languageId)}
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