import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { getUUIDByString, randomUUID } from "../util"
import { Language } from "./language"
import { PeerReviewQuestion } from "./peer_review_question"
import { Quiz } from "./quiz"

@Entity()
export class PeerReviewCollection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>

  @Index()
  @Column({ nullable: true })
  public quizId: string | null

  @OneToMany(
    type => PeerReviewCollectionTranslation,
    prct => prct.peerReviewCollection,
    { eager: true, cascade: true },
  )
  public texts: PeerReviewCollectionTranslation[]

  @OneToMany(type => PeerReviewQuestion, prq => prq.peerReviewCollection, {
    eager: true,
    cascade: true,
  })
  public questions: PeerReviewQuestion[]

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: PeerReviewCollection) {
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
        (text: PeerReviewCollectionTranslation) =>
          (text.peerReviewCollectionId = this.id),
      )
    }

    if (this.questions) {
      this.questions.forEach((question: PeerReviewQuestion) => {
        question.peerReviewCollectionId = this.id
        question.quizId = this.quizId
      })
    }
  }
}

@Entity()
export class PeerReviewCollectionTranslation extends BaseEntity {
  @ManyToOne(type => PeerReviewCollection, prqc => prqc.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  public peerReviewCollection: Promise<PeerReviewCollection>
  @Index()
  @PrimaryColumn()
  public peerReviewCollectionId: string

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

  constructor(data?: PeerReviewCollectionTranslation) {
    super()

    if (!data) {
      return
    }

    if (data.peerReviewCollectionId) {
      this.peerReviewCollectionId = data.peerReviewCollectionId
    }
    this.languageId = data.languageId || "unknown"
    this.title = data.title
    this.body = data.body
  }
}
