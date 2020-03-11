import React from "react"
import ExpandedResearchAgreement from "./ExpandedResearchAgreement"
import ShortResearchAgreement from "./ShortResearchAgreement"

class ResearchAgreement extends React.Component<any, any> {
  public render() {
    if (!this.props.expanded) {
      return <ShortResearchAgreement {...this.props} />
    } else {
      return <ExpandedResearchAgreement {...this.props} />
    }
  }
}

export default ResearchAgreement
