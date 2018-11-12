import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { PeerReviewQuestion } from "./peer_review_question"
import { Quiz } from "./quiz"
import { getUUIDByString, randomUUID } from "../util"

@Entity()
export class PeerReviewQuestionCollection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @Column()
  public quizId: string

  @OneToMany(
    type => PeerReviewQuestionCollectionTranslation,
    prqct => prqct.peerReviewQuestionCollection,
    { eager: true },
  )
  public texts: PeerReviewQuestionCollectionTranslation[]

  @OneToMany(type => PeerReviewQuestion, prq => prq.collection, { eager: true })
  public questions: PeerReviewQuestion[]

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: PeerReviewQuestionCollection) {
    super()

    if (!data) {
      return
    }

    this.quizId = data.quizId
    this.texts = data.texts
    this.questions = data.questions
  }

  @BeforeInsert()
  addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach(
        (text: PeerReviewQuestionCollectionTranslation) =>
          (text.peerReviewQuestionCollectionId = this.id),
      )
    }

    if (this.questions) {
      this.questions.forEach(
        (question: PeerReviewQuestion) => (question.collectionId = this.id),
      )
    }
  }
}

@Entity()
export class PeerReviewQuestionCollectionTranslation extends BaseEntity {
  @ManyToOne(type => PeerReviewQuestionCollection, prqc => prqc.id)
  public peerReviewQuestionCollection: Promise<PeerReviewQuestionCollection>
  @PrimaryColumn()
  public peerReviewQuestionCollectionId: string

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

  constructor(data?: PeerReviewQuestionCollectionTranslation) {
    super()

    if (!data) {
      return
    }

    this.peerReviewQuestionCollectionId = data.peerReviewQuestionCollectionId
    this.languageId = data.languageId || "unknown"
    this.title = data.title
    this.body = data.body
  }
}
