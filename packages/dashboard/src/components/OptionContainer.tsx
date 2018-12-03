import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Select,
    SvgIcon,
    Switch,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'
import Option from './Option'

const OptionContainer = SortableContainer((props: any) => {

    const newOption = item => event => {
        props.addOption(item)
    }

    const options = props.edit.items[props.index].options
    
    return (
        <Grid container={true} spacing={16}>
            {options.sort((o1, o2) => o1.order - o2.order).map((option, index) => {
                const text = option.texts.find(t => t.languageId === props.language)
                return (
                    <Option
                        handleChange={props.handleChange}
                        key={option.id || props.index + index}
                        index={index}
                        collection={`items[${props.index}].options`}
                        itemIndex={props.index}
                        textIndex={option.texts.findIndex(t => t.languageId === props.language)}
                        correct={option.correct}
                        title={text.title}
                        body={text.body}
                        successMessage={text.successMessage}
                        failureMessage={text.failureMessage}
                    />
                )
            })}
            <Grid item={true} xs={3} >
                <Paper style={{ padding: 5, marginBottom: 5 }}>
                    <Button onClick={newOption(props.index)} fullWidth={true}>add</Button>
                </Paper>
            </Grid>
        </Grid>
    )
})

const mapStateToProps = (state) => {
    return {
        edit: state.edit
    }
}

const mapDispatchToProps = {
    addOption
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionContainer)