import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { Quiz } from "./quiz"

@Entity()
export class PeerReviewQuestion extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Quiz

  @OneToMany(
    type => PeerReviewQuestionTranslation,
    prqt => prqt.peerReviewQuestion,
  )
  public texts: PeerReviewQuestionTranslation[]

  @Column() public default: boolean
  @Column({ type: "enum", enum: ["essay", "multiple-choice"] })
  public type: string

  @Column({ default: true })
  public answerRequired: boolean

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

  @Column("text") public title: string
  @Column("text") public body: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
