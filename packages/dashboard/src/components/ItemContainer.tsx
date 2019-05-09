import React, { ComponentClass } from "react"
import { connect } from "react-redux"
import { SortableContainer } from "react-sortable-hoc"
import Item from "./Item"
import SortableWrapper from "./SortableWrapper"

const ItemContainer: ComponentClass<any, any> = SortableContainer(
  (props: any) => {
    return (
      <div>
        {props.items.map((item, index) => {
          const text = item.texts.find(t => t.languageId === props.language)
          return (
            <SortableWrapper
              key={item.id || item.type + index}
              index={index}
              collection="items"
            >
              <Item
                newlyAdded={props.newest && item.order === props.newest.order}
                language={props.language}
                handleChange={props.handleChange}
                index={index}
                textIndex={item.texts.findIndex(
                  t => t.languageId === props.language,
                )}
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
                remove={props.remove}
                minWords={item.minWords}
                maxWords={item.maxWords}
                scrollToNew={props.scrollToNew}
                expandItem={props.expandItem}
                expanded={props.expandedItems[item.order]}
              />
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
  }
}

export default connect(mapStateToProps)(ItemContainer)
