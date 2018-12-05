import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { PeerReviewQuestionAnswer } from "./peer_review_question_answer"
import { PeerReviewQuestionCollection } from "./peer_review_question_collection"
import { QuizAnswer } from "./quiz_answer"
import { User } from "./user"

@Entity()
export class PeerReview extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => QuizAnswer, qa => qa.id)
  public quizAnswer: QuizAnswer
  @Column()
  public quizAnswerId: string

  @ManyToOne(type => User, user => user.id)
  public user: User
  @Column("int")
  public userId: number

  @ManyToOne(type => PeerReviewQuestionCollection, prqc => prqc.id, {
    nullable: true,
  })
  public peerReviewQuestionCollection?: PeerReviewQuestionCollection
  @Column({ nullable: true })
  public peerReviewQuestionCollectionId?: string

  @Column({ type: String, array: true })
  public rejectedQuizAnswerIds: string[]

  @OneToMany(type => PeerReviewQuestionAnswer, prqa => prqa.peerReview)
  public answers: Promise<PeerReviewQuestionAnswer[]>

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
