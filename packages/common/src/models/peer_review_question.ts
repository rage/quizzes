import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(
    type => Quiz,
    quiz => quiz.id,
    { onDelete: "CASCADE" },
  )
  @JoinColumn()
  public quiz: Promise<Quiz>
  @Column({ nullable: true })
  public quizId: string | null

  @ManyToOne(
    type => PeerReviewQuestionCollection,
    prqc => prqc.id,
    {
      nullable: true,
    },
  )
  public collection?: PeerReviewQuestionCollection
  @Column({ nullable: true })
  public collectionId: string | null

  @OneToMany(
    type => PeerReviewQuestionTranslation,
    prqt => prqt.peerReviewQuestion,
    { eager: true, cascade: true },
  )
  public texts: PeerReviewQuestionTranslation[]

  @Column()
  public default: boolean
  @Column({ type: "enum", enum: ["essay", "grade"] })
  public type: string
  // TODO(?): add scale for grade?

  @Column({ default: true })
  public answerRequired: boolean

  @Column("int")
  public order: number

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: PeerReviewQuestion) {
    super()

    if (!data) {
      return
    }

    if (data.quizId) {
      this.quizId = data.quizId
    }
    this.collectionId = data.collectionId // TODO: what to do with these
    this.texts = data.texts
    this.type = data.type
    this.answerRequired = data.answerRequired
    this.order = data.order
  }

  @BeforeInsert()
  private addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach(
        (text: PeerReviewQuestionTranslation) =>
          (text.peerReviewQuestionId = this.id),
      )
    }
  }
}

@Entity()
export class PeerReviewQuestionTranslation extends BaseEntity {
  @ManyToOne(
    type => PeerReviewQuestion,
    prq => prq.id,
    { onDelete: "CASCADE" },
  )
  @JoinColumn()
  public peerReviewQuestion: Promise<PeerReviewQuestion>
  @PrimaryColumn()
  public peerReviewQuestionId: string

  @ManyToOne(
    type => Language,
    lang => lang.id,
  )
  @JoinColumn()
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

  constructor(data?: PeerReviewQuestionTranslation) {
    super()

    if (!data) {
      return
    }

    if (data.peerReviewQuestionId) {
      this.peerReviewQuestionId = data.peerReviewQuestionId
    }
    this.languageId = data.languageId || "unknown"
    this.title = data.title
    this.body = data.body
  }
}
