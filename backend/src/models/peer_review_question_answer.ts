import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm"
import { PeerReview } from "./peer_review"
import { PeerReviewQuestion } from "./peer_review_question"

@Entity()
export class PeerReviewQuestionAnswer extends BaseEntity {
  @ManyToOne(type => PeerReview, pr => pr.id, { primary: true })
  public peerReview: Promise<PeerReview>
  @ManyToOne(type => PeerReviewQuestion, prq => prq.id, { primary: true })
  public peerReviewQuestion: Promise<PeerReviewQuestion>

  @Column({ type: "int", nullable: true })
  public value: number
  @Column({ type: "text", nullable: true })
  public text: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
