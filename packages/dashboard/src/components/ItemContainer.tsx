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
import React, { ComponentClass } from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'
import Item from './Item'
import OptionContainer from './OptionContainer'
import SortableWrapper from './SortableWrapper'

const ItemContainer: ComponentClass<any, any> = SortableContainer((props: any) => {
    return (
        <div>
            {props.items.map((item, index) => {
                const text = item.texts.find(t => t.languageId === props.language)
                return (
                    <SortableWrapper key={item.id || item.type + index} index={index} collection="items">
                        <Item
                            language={props.language}
                            handleChange={props.handleChange}
                            index={index}
                            handleSort={props.handleSort}
                            textIndex={item.texts.findIndex(t => t.languageId === props.language)}
                            order={item.order}
                            validityRegex={item.validityRegex}
                            formatRegex={item.formatRegex}
                            options={item.options}
                            title={text.title}
                            body={text.body}
                            successMessage={text.successMessage}
                            failureMessage={text.failureMessage}
                            type={item.type}
                            remove={props.remove}
                        />
                    </SortableWrapper>
                )
            })}
        </div>
    )
})

const mapStateToProps = (state: any) => {
    return {
        language: state.filter.language,
    }
}

export default connect(mapStateToProps)(ItemContainer)