import React, { ComponentClass } from "react"
import { connect } from "react-redux"
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc"
import PeerReviewQuestion from "./PeerReviewQuestion"
import SortableWrapper from "./SortableWrapper"

const PeerReviewQuestionContainer = SortableContainer((props: any) => {
  const questions =
    props.edit.peerReviewCollections[props.collectionIndex].questions

  return (
    <div>
      {questions.map((prq, index) => {
        const text = prq.texts.find(t => t.languageId === props.language)
        return (
          <SortableWrapper
            key={prq.id || prq.type + index}
            index={index}
            collection={`peerReviewCollections[${props.collectionIndex}.questions]`}
          >
            <PeerReviewQuestion
              answerRequired={prq.answerRequired}
              default={prq.default}
              order={prq.order}
              type={prq.type}
              title={text.title}
              body={text.body}
              index={index}
              textIndex={prq.texts.findIndex(
                t => t.languageId === props.language,
              )}
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
