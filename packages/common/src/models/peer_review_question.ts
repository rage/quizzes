import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { getUUIDByString, randomUUID } from "../util"
import { Language } from "./language"
import { PeerReviewQuestionCollection } from "./peer_review_question_collection"
import { Quiz } from "./quiz"

@Entity()
export class PeerReviewQuestion extends BaseEntity {
  constructor(data?: PeerReviewQuestion) {
    super()

    if (!data) {
      return
    }

    this.id = data.id || randomUUID()
    this.quizId = data.quizId
    this.collectionId = data.collectionId // TODO: what to do with these
    this.texts = data.texts
    this.type = data.type
    this.answerRequired = data.answerRequired
    this.order = data.order

    if (this.texts) {
      this.texts.forEach(
        (text: PeerReviewQuestionTranslation) =>
          (text.peerReviewQuestionId = this.id),
      )
    }
  }

  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @Column()
  public quizId: string

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

  @Column()
  public default: boolean
  @Column({ type: "enum", enum: ["essay", "grade"] })
  public type: string

  @Column({ default: true })
  public answerRequired: boolean

  @Column("int")
  public order: number

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class PeerReviewQuestionTranslation extends BaseEntity {
  constructor(data?: PeerReviewQuestionTranslation) {
    super()

    if (!data) {
      return
    }

    this.peerReviewQuestionId = data.peerReviewQuestionId
    this.languageId = data.languageId || getUUIDByString("default")
    this.title = data.title
    this.body = data.body
  }

  @ManyToOne(type => PeerReviewQuestion, prq => prq.id)
  public peerReviewQuestion: Promise<PeerReviewQuestion>
  @PrimaryColumn()
  public peerReviewQuestionId: string

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column("text")
  public title: string
  @Column("text")
  public body: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
