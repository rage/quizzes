import React from 'react'
import { Checkbox } from '@material-ui/core'

const CheckboxWidget = ({ answered, options, optionAnswers, handleOptionChange }) => {

    const toggle = () => {
        if (!optionAnswers[0]) {
            handleOptionChange(options[0].id)()
        } else {
            handleOptionChange(-1)()
        }
    }

    return (<div>
        <Checkbox value={optionAnswers[0] && optionAnswers[0].quizOptionId}
            {...checkboxOptions(answered)}
            onChange={toggle} />
        {options[0].texts[0].title}

    </div>)
}


const checkboxOptions = (answered) => {
    return {
        color: "primary", //(answered ? "default" : "primary"),
        disabled: answered,
        //checked: answered
    }
}


export default CheckboxWidget