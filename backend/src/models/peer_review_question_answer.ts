import { BaseEntity, Column, Entity, ManyToOne } from "typeorm"
import { PeerReview } from "./peer_review"
import { PeerReviewQuestion } from "./peer_review_question"

@Entity()
export class PeerReviewQuestionAnswer extends BaseEntity {
  @ManyToOne(type => PeerReview, pr => pr.id, { primary: true })
  public peerReview: PeerReview
  @ManyToOne(type => PeerReviewQuestion, prq => prq.id, { primary: true })
  public peerReviewQuestion: PeerReviewQuestion

  @Column("int") public value: number
  @Column("text") public text: string
}
