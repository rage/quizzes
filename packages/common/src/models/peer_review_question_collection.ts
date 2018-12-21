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
  JoinColumn,
} from "typeorm"
import { getUUIDByString, randomUUID } from "../util"
import { Language } from "./language"
import { PeerReviewQuestion } from "./peer_review_question"
import { Quiz } from "./quiz"

@Entity()
export class PeerReviewQuestionCollection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @Column({ nullable: true })
  public quizId: string | null

  @OneToMany(
    type => PeerReviewQuestionCollectionTranslation,
    prqct => prqct.peerReviewQuestionCollection,
    { eager: true, cascade: true },
  )
  public texts: PeerReviewQuestionCollectionTranslation[]

  @OneToMany(type => PeerReviewQuestion, prq => prq.collection, {
    eager: true,
    cascade: true,
  })
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

    if (data.quizId) {
      this.quizId = data.quizId
    }
    this.texts = data.texts
    this.questions = data.questions
  }

  @BeforeInsert()
  private addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach(
        (text: PeerReviewQuestionCollectionTranslation) =>
          (text.peerReviewQuestionCollectionId = this.id),
      )
    }

    if (this.questions) {
      this.questions.forEach((question: PeerReviewQuestion) => {
        question.collectionId = this.id
        question.quizId = this.quizId
      })
    }
  }
}

@Entity()
export class PeerReviewQuestionCollectionTranslation extends BaseEntity {
  @ManyToOne(type => PeerReviewQuestionCollection, prqc => prqc.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  public peerReviewQuestionCollection: Promise<PeerReviewQuestionCollection>
  @PrimaryColumn()
  public peerReviewQuestionCollectionId: string | undefined

  @ManyToOne(type => Language, lang => lang.id)
  @JoinColumn()
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column({ type: "text", nullable: true })
  public title?: string
  @Column({ type: "text", nullable: true })
  public body?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: PeerReviewQuestionCollectionTranslation) {
    super()

    if (!data) {
      return
    }

    if (data.peerReviewQuestionCollectionId) {
      this.peerReviewQuestionCollectionId = data.peerReviewQuestionCollectionId
    }
    this.languageId = data.languageId || "unknown"
    this.title = data.title
    this.body = data.body
  }
}
