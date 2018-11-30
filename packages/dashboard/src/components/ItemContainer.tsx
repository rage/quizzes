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
import Item from './Item'
import OptionContainer from './OptionContainer'

const ItemContainer = SortableContainer((props: any) => {
    return (
        <div>
            {props.quiz.items.sort((i1, i2) => i1.order - i2.order).map((item, i) => {
                const text = item.texts.find(t => t.languageId === props.language)
                return (
                    <SortableWrapper key={item.id || item.type + i} index={i} collection="items">
                        <Item
                            language={props.language}
                            handleChange={props.handleChange}
                            index={i}
                            handleSort={props.handleSort}
                            addOption={props.addOption}
                            collection="items"
                            textIndex={item.texts.findIndex(t => t.languageId === props.language)}
                            order={item.order}
                            validityRegex={item.validityRegex}
                            formatRegex={item.formatRegex}
                            options={item.options}
                            title={text.title}
                            body={text.body}
                            successMessage={text.successMessage}
                            failureMessage={text.failureMessage}
                        />
                    </SortableWrapper>
                )
            })}
        </div>
    )
})

const SortableWrapper = SortableElement((props: any) => <div>{props.children}</div>)

export default connect()(ItemContainer)