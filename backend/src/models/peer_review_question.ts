import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
}

@Entity()
export class PeerReviewQuestionTranslation extends BaseEntity {
  @ManyToOne(type => PeerReviewQuestion, prq => prq.id, { primary: true })
  public peerReviewQuestion: string
  @ManyToOne(type => Language, lang => lang.id, { primary: true })
  public language: Language

  @Column("text") public question: string
}
