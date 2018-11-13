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
  PromiseUtils,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { Course } from "./course"
import { Language } from "./language"
import { PeerReviewQuestion } from "./peer_review_question"
import { QuizItem } from "./quiz_item"
import { getUUIDByString, randomUUID } from "../util"

@Entity()
export class Quiz extends BaseEntity {
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
    this.excludedFromScore = data.excludedFromScore
    this.texts = data.texts
    this.items = data.items
    this.peerReviewQuestions = data.peerReviewQuestions
  }

  @BeforeInsert()
  addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach((text: QuizTranslation) => (text.quizId = this.id))
    }

    if (this.items) {
      this.items.forEach((item: QuizItem) => (item.quizId = this.id))
    }

    if (this.peerReviewQuestions) {
      this.peerReviewQuestions.forEach(
        (question: PeerReviewQuestion) => (question.quizId = this.id),
      )
    }
  }

  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Course, course => course.id, { eager: true }) // was: lazy
  public course: Course
  @Column()
  public courseId: string

  @OneToMany(type => QuizTranslation, qt => qt.quiz, {
    eager: true,
    cascade: true,
  })
  public texts: QuizTranslation[]

  @Column("int")
  public part: number
  @Column({ type: "int", nullable: true })
  public section?: number

  @Column({ type: "timestamp", nullable: true })
  public deadline?: Date
  @Column({ type: "timestamp", nullable: true })
  public open?: Date

  @OneToMany(type => QuizItem, qi => qi.quiz, { eager: true, cascade: true }) // was: not eager
  public items?: QuizItem[]

  @OneToMany(type => PeerReviewQuestion, prq => prq.quiz, { eager: true }) // was: not eager
  public peerReviewQuestions: PeerReviewQuestion[]

  @Column({ default: false })
  public excludedFromScore: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizTranslation extends BaseEntity {
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

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @PrimaryColumn()
  public quizId: string

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column({ type: "text", default: "" })
  public title: string
  @Column({ type: "text", default: "" })
  public body: string
  @Column({ type: "text", nullable: true })
  public submitMessage?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
