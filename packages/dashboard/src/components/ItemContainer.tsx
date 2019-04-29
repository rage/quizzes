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
import SortableWrapper from "./SortableWrapper"

const ItemContainer: ComponentClass<any, any> = SortableContainer(
  (props: any) => {
    return (
      <div>
        {props.items.map((item, index) => {
          const text = item.texts.find(t => t.languageId === props.language)
          return (
            <SortableWrapper
              key={
                // item.id ||
                `${item.type}${item.order}${item.expanded ? "ju" : "ei"}`
              }
              index={index}
              collection="items"
            >
              {/* 
              seeminly unnecessary div fixed a quirk 
              https://github.com/clauderic/react-sortable-hoc/issues/367#issuecomment-380523336
            */}
              <div>
                <Item
                  newlyAdded={props.newest && item.order === props.newest.order}
                  language={props.language}
                  handleChange={props.handleChange}
                  index={index}
                  textIndex={item.texts.findIndex(
                    t => t.languageId === props.language,
                  )}
                  items={props.items}
                  onSortEnd={props.onSortEnd}
                  order={item.order}
                  validityRegex={item.validityRegex}
                  formatRegex={item.formatRegex}
                  options={item.options}
                  title={text.title}
                  body={text.body}
                  successMessage={text.successMessage}
                  failureMessage={text.failureMessage}
                  type={item.type}
                  minWords={item.minWords}
                  maxWords={item.maxWords}
                  scrollToNew={props.scrollToNew}
                  expandItem={props.expandItem}
                  expanded={props.expandedItems[item.order]}
                />
              </div>
            </SortableWrapper>
          )
        })}
      </div>
    )
  },
)

const mapStateToProps = (state: any) => {
  return {
    language: state.filter.language,
    items: state.edit.items,
  }
}

export default connect(mapStateToProps)(ItemContainer)
