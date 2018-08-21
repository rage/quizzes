import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { PeerReviewQuestionCollection } from "./peer_review_question_collection"
import { Quiz } from "./quiz"

@Entity()
export class PeerReviewQuestion extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @Column() public quizId: string

  @ManyToOne(type => PeerReviewQuestionCollection, prqc => prqc.id, {
    nullable: true,
  })
  public collection?: PeerReviewQuestionCollection
  @Column({ nullable: true })
  public collectionId: string

  @OneToMany(
    type => PeerReviewQuestionTranslation,
    prqt => prqt.peerReviewQuestion,
    { eager: true },
  )
  public texts: PeerReviewQuestionTranslation[]

  @Column() public default: boolean
  @Column({ type: "enum", enum: ["essay", "grade"] })
  public type: string

  @Column({ default: true })
  public answerRequired: boolean

  @Column("int") public order: number

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class PeerReviewQuestionTranslation extends BaseEntity {
  @ManyToOne(type => PeerReviewQuestion, prq => prq.id, { primary: true })
  public peerReviewQuestion: string
  @ManyToOne(type => Language, lang => lang.id, { primary: true })
  public language: Language
  @Column() public languageId: string

  @Column("text") public title: string
  @Column("text") public body: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
