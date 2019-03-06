import React from "react"
import { Button, Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core"

export default (props) => {

    const {
        answered,
        correct,
        failureMessage,
        handleOptionChange,
        itemTitle,
        options,
        optionAnswers,
        successMessage
    } = props

    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell style={{ width: "40%" }} >
                        <Typography variant="subtitle1" >{itemTitle}</Typography>
                        {answered
                            ? <Typography variant="body1" style={{ borderLeft: `4px solid ${correct ? "green" : "red"}`, padding: 3 }} >
                                {correct ? successMessage : failureMessage}
                            </Typography>
                            : ""
                        }
                    </TableCell>
                    {options.map(option => {
                        const selected = optionAnswers.find(oa => oa.quizOptionId === option.id)
                        return (
                            <TableCell key={option.id} style={{ width: `${40 / options.length}%` }}>
                                {answered
                                    ? <Button
                                        color="inherit"
                                        {...selectButtonStyle(selected, option.correct)}
                                    >
                                        {option.texts[0].title}
                                    </Button>
                                    : <Button
                                        variant="contained"
                                        color={selected ? "primary" : "default"}
                                        onClick={handleOptionChange(option.id)}
                                    >
                                        {option.texts[0].title}
                                    </Button>}
                            </TableCell>
                        )
                    })}
                </TableRow>
            </TableBody>
        </Table>
    )
}

const selectButtonStyle = (selected, correct) => {
    return {
        variant: selected ? "contained" : "outlined",
        style: selected
            ? correct
                ? { color: "white", backgroundColor: "green" }
                : { color: "white", backgroundColor: "red" }
            : correct
                ? { color: "green", outlineColor: "green" }
                : {}
    }
}
