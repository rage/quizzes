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
  Typography,
} from "@material-ui/core"
import React, { ComponentClass } from "react"
import { connect } from "react-redux"
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc"
import {
  addItem,
  addOption,
  changeAttr,
  changeOrder,
  newQuiz,
  save,
  setEdit,
} from "../store/edit/actions"
import Item from "./Item"
import OptionContainer from "./OptionContainer"
import PeerReviewCollection from "./PeerReviewCollection"
import PeerReviewQuestion from "./PeerReviewQuestion"
import SortableWrapper from "./SortableWrapper"

const PeerReviewCollectionContainer = SortableContainer((props: any) => {
  return (
    <div>
      {props.peerReviewCollections.map((prqc, index) => {
        const text = prqc.texts.find(t => t.languageId === props.language)
        return (
          <PeerReviewCollection
            key={prqc.id || text.title * index}
            title={text.title}
            body={text.body}
            index={index}
            questions={prqc.questions}
            textIndex={prqc.texts.findIndex(
              t => t.languageId === props.language,
            )}
            handleChange={props.handleChange}
            remove={props.remove}
            handleSort={props.handleSort}
          />
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

export default connect(mapStateToProps)(PeerReviewCollectionContainer)
