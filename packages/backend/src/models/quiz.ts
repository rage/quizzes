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
  PromiseUtils,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { getUUIDByString, randomUUID } from "../util/index"
import { Course } from "./course"
import { Language } from "./language"
import { PeerReviewCollection } from "./peer_review_collection"
import { PeerReviewQuestion } from "./peer_review_question"
import { QuizItem } from "./quiz_item"

type GrantPointsPolicyType =
  | "grant_whenever_possible"
  | "grant_only_when_answer_fully_correct"

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @Column({
    type: "varchar",
    default: "grant_whenever_possible",
  })
  public grantPointsPolicy?: GrantPointsPolicyType

  @ManyToOne(
    type => Course,
    course => course.id,
    { eager: false },
  ) // was: lazy
  public course: Course
  @Column()
  public courseId: string

  @OneToMany(
    type => QuizTranslation,
    qt => qt.quiz,
    {
      eager: false,
      cascade: true,
    },
  )
  public texts: QuizTranslation[]

  @Column("int")
  public part: number
  @Column({ type: "int", nullable: true })
  public section?: number

  @Column({ type: "int", default: 1 })
  public points: number

  @Column({ type: "smallint", default: 1 })
  public tries: number

  @Column({ type: "boolean", default: true })
  public triesLimited: boolean

  @Column({ type: "timestamp", nullable: true })
  public deadline?: Date
  @Column({ type: "timestamp", nullable: true })
  public open?: Date

  @OneToMany(
    type => QuizItem,
    qi => qi.quiz,
    {
      eager: false,
      cascade: true,
    },
  ) // was: not eager
  public items?: QuizItem[]

  @OneToMany(
    type => PeerReviewCollection,
    prc => prc.quiz,
    {
      eager: false,
      cascade: true,
    },
  ) // was: not eager
  public peerReviewCollections: PeerReviewCollection[]

  @Column({ default: true })
  public autoConfirm: boolean
  @Column({ default: false })
  public excludedFromScore: boolean
  @Column({ default: false })
  public awardPointsEvenIfWrong: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: Quiz) {
    super()

    if (!data) {
      return
    }

    this.courseId = data.courseId || getUUIDByString("default")
    this.part = data.part || 0
    this.section = data.section || 0
    this.deadline = data.deadline
    this.open = data.open
    this.texts = data.texts
    this.items = data.items
    this.peerReviewCollections = data.peerReviewCollections
  }

  @BeforeInsert()
  private addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach((text: QuizTranslation) => (text.quizId = this.id))
    }

    if (this.items) {
      this.items.forEach((item: QuizItem) => (item.quizId = this.id))
    }

    if (this.peerReviewCollections) {
      this.peerReviewCollections.forEach(
        (question: PeerReviewCollection) => (question.quizId = this.id),
      )
    }
  }
}

@Entity()
export class QuizTranslation extends BaseEntity {
  @ManyToOne(
    type => Quiz,
    quiz => quiz.id,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  )
  @JoinColumn()
  public quiz: Quiz
  @PrimaryColumn()
  public quizId: string

  @ManyToOne(
    type => Language,
    lang => lang.id,
  )
  @JoinColumn()
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column({ type: "text", default: "" })
  public title: string
  @Column({ type: "text", default: "" })
  public body: string
  @Column({ type: "text", nullable: true, select: false })
  public submitMessage?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: QuizTranslation) {
    super()

    if (!data) {
      return
    }

    if (data.quiz) {
      this.quiz = data.quiz
    }
    if (data.quizId) {
      this.quizId = data.quizId
    }
    this.languageId = data.languageId || "unknown"
    this.title = data.title
    this.body = data.body
    this.submitMessage = data.submitMessage || undefined
  }
}
