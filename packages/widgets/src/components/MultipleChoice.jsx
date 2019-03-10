import React from "react"
import { Button, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core"

export default (props) => {

    const {
        answered,
        correct,
        failureMessage,
        handleOptionChange,
        itemTitle,
        options,
        optionAnswers,
        singleItem,
        successMessage
    } = props

    let direction = "row"
    let questionWidth = 5
    let optionContainerWidth = 7

    if (singleItem) {
        const maxOptionLength = Math.max(...options.map(option => option.texts[0].title.length))
        const width = maxOptionLength > 100 ? 12 : Math.ceil(maxOptionLength / (8 + 1 / 3))
        optionContainerWidth = Math.min(width, 12)
        questionWidth = 12
        direction = "column"
    }

    return (
        <Grid container direction={direction} style={{ marginBottom: 10 }} >
            <Grid item sm={questionWidth} >
                <Typography variant="subtitle1" >{itemTitle}</Typography>
                {answered
                    ? <Typography variant="body1" style={{ borderLeft: `4px solid ${correct ? "green" : "red"}`, padding: 3 }} >
                        {correct ? successMessage : failureMessage}
                    </Typography>
                    : ""
                }
            </Grid>
            <Grid item sm={optionContainerWidth} >
                <Grid container direction={direction} justify="space-evenly" style={{ paddingTop: 7 }} >
                    {options.map(option => {
                        const selected = optionAnswers.find(oa => oa.quizOptionId === option.id)
                        const title = option.texts[0].title
                        return (
                            <Grid item key={option.id} >
                                {answered
                                    ? <Button
                                        fullWidth
                                        color="inherit"
                                        {...selectButtonStyle(selected, option.correct)}
                                    >
                                        {title}
                                    </Button>
                                    : <Button
                                        variant="outlined"
                                        fullWidth
                                        color={selected ? "primary" : "default"}
                                        style={{ textTransform: "none" }}
                                        onClick={handleOptionChange(option.id)}
                                    >
                                        {title}
                                    </Button>}
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Grid>
    )
}

const selectButtonStyle = (selected, correct) => {
    const style = { textTransform: "none" }
    return {
        variant: selected ? "contained" : "outlined",
        style: selected
            ? correct
                ? { ...style, ...{ color: "white", backgroundColor: "green" } }
                : { ...style, ...{ color: "white", backgroundColor: "red" } }
            : correct
                ? { ...style, ...{ color: "green", outlineColor: "green" } }
                : style
    }
}
