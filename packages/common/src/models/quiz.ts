import {
  BaseEntity,
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
import {
  INewQuizQuery,
  INewQuizTranslation,
  INewQuizItem,
  INewPeerReviewQuestion,
} from "../types"
import { getUUIDByString, randomUUID } from "../util"

@Entity()
export class Quiz extends BaseEntity {
  constructor(data?: INewQuizQuery) {
    super()

    if (!data) {
      return
    }

    if (data.id) {
      this.id = data.id
    }
    this.courseId = data.courseId || getUUIDByString("default")
    this.part = data.part || 0
    this.section = data.section || 0
    this.deadline = data.deadline
    this.open = data.open

    if (data.texts) {
      this.texts = data.texts.map(
        (text: INewQuizTranslation) =>
          new QuizTranslation({ ...text, quizId: data.id }),
      )
    }

    if (data.items) {
      this.items = Promise.all(
        data.items.map(
          (item: INewQuizItem) =>
            new QuizItem({ ...item, quizId: data.id, id: randomUUID() }),
        ),
      )
    }

    /*     if (data.peerReviewQuestions) {
      this.peerReviewQuestions = data.peerReviewQuestions.map((prq: INewPeerReviewQuestion) => new PeerReviewQuestion({ ...prq, quiz: this }))
    } */
  }

  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Course, course => course.id, { eager: true })
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

  @OneToMany(type => QuizItem, qi => qi.quiz, { lazy: true, cascade: true }) // was: not eager
  public items: Promise<QuizItem[]>

  @OneToMany(type => PeerReviewQuestion, prq => prq.quiz, { lazy: true }) // was: not eager
  public peerReviewQuestions: Promise<PeerReviewQuestion[]>

  @Column({ default: false })
  public excludedFromScore: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizTranslation extends BaseEntity {
  constructor(data?: INewQuizTranslation) {
    super()

    console.log(data)

    if (!data) {
      return
    }

    if (data.quiz) {
      this.quiz = PromiseUtils.create(data.quiz)
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
