import React from "react"
import { connect } from "react-redux"
import { SortableContainer } from "react-sortable-hoc"

import PeerReviewCollection from "./PeerReviewCollection"

const PeerReviewCollectionContainer = SortableContainer((props: any) => {
  return (
    <div>
      {props.peerReviewCollections.map((prqc, index) => {
        const text = prqc.texts.find((t) => t.languageId === props.language)
        return (
          <PeerReviewCollection
            key={prqc.id || text.title * index}
            title={text.title}
            body={text.body}
            index={index}
            questions={prqc.questions}
            textIndex={prqc.texts.findIndex(
              (t) => t.languageId === props.language,
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
