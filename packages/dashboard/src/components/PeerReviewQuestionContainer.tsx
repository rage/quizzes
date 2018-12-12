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
import Item from './Item'
import OptionContainer from './OptionContainer'
import PeerReviewQuestion from './PeerReviewQuestion'
import SortableWrapper from './SortableWrapper'

const PeerReviewQuestionContainer = SortableContainer((props: any) => {

    const questions = props.edit.peerReviewQuestionCollections[props.collectionIndex].questions

    return (
        <div>
            {questions.map((prq, index) => {
                const text = prq.texts.find(t => t.languageId === props.language)
                return (
                    <SortableWrapper key={prq.id || prq.type + index} index={index} collection={`peerReviewQuestionCollections[${props.collectionIndex}.questions]`}>
                        <PeerReviewQuestion
                            answerRequired={prq.answerRequired}
                            default={prq.default}
                            order={prq.order}
                            type={prq.type}
                            title={text.title}
                            body={text.body}
                            index={index}
                            textIndex={prq.texts.findIndex(t => t.languageId === props.language)}
                            collectionIndex={props.collectionIndex}
                            handleChange={props.handleChange}
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
        edit: state.edit,
        language: state.filter.language,
    }
}

export default connect(mapStateToProps)(PeerReviewQuestionContainer)