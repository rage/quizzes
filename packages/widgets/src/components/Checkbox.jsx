import React from 'react'
import { Checkbox } from '@material-ui/core'

const CheckboxWidget = ({ itemTitle }) => {

    return (<div>
        { itemTitle }
        <Checkbox />
    </div>)
}


export default CheckboxWidget