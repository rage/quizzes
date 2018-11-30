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
    Tab,
    Tabs,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'
import ItemContainer from './ItemContainer'
import OptionContainer from './OptionContainer'

const TabContainer = (props: any) => {
    const index = props.quiz.texts.findIndex(t => t.languageId === props.language)
    return (
        <div>
            <div style={{ marginTop: 0 }}>
                <TextField
                    onChange={props.handleChange(`texts[${index}].title`)}
                    label='title'
                    value={props.quiz.texts[index].title}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                />
                <TextField
                    onChange={props.handleChange(`texts[${index}].body`)}
                    label='body'
                    value={props.quiz.texts[index].body}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                    rowsMax="10"
                />
            </div>
            <div style={{ marginTop: 50 }}>
                <Typography variant='subtitle1'>Items:</Typography>
                <ItemContainer
                    onSortEnd={props.onSortEnd}
                    hidden={props.hidden}
                    quiz={props.quiz}
                    language={props.language}
                    handleChange={props.handleChange}
                    handleSort={props.onSortEnd}
                    addItem={props.addItem}
                    addOption={props.addOption}
                    useDragHandle={true}
                />
            </div>
        </div>
    )
}

export default connect()(TabContainer)