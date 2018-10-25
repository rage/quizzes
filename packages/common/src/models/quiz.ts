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
import {
  INewPeerReviewQuestion,
  INewQuizItem,
  INewQuizQuery,
  INewQuizTranslation
} from "../types"
import { getUUIDByString } from "../util"
import { Course } from "./course"
import { Language } from "./language"
import { PeerReviewQuestion } from "./peer_review_question"
import { QuizItem } from "./quiz_item"

@Entity()
export class Quiz extends BaseEntity {

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

  @OneToMany(type => QuizItem, qi => qi.quiz, { lazy: true }) // was: not eager
  public items: Promise<QuizItem[]>

  @OneToMany(type => PeerReviewQuestion, prq => prq.quiz, { lazy: true }) // was: not eager
  public peerReviewQuestions: Promise<PeerReviewQuestion[]>

  @Column({ default: false })
  public excludedFromScore: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: INewQuizQuery) {
    super()

    console.log("quiz constructor got", data)
    if (!data || (data && !data.id)) {
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
      // this.texts = data.texts.map()
    }

    /*     if (data.items) {
      this.items = 
        Promise.all(data.items.map(
          async (item: QuizItem) => new QuizItem(await item),
        ))
      
    } */

    /*     if (data.peerReviewQuestions) {
      this.peerReviewQuestions = data.peerReviewQuestions.map((prq: INewPeerReviewQuestion) => new PeerReviewQuestion({ ...prq, quiz: this }))
    } */
  }
}

@Entity()
export class QuizTranslation extends BaseEntity {
  
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
  
  constructor(data?: INewQuizTranslation) {
    super()

    console.log(data)

    if (!data) {
      return
    }

    console.log("translation constructor received", data)

    if (data.quizId) {
      this.quizId = data.quizId
    }
    this.languageId = data.languageId || "unknown"
    this.title = data.title
    this.body = data.body
    this.submitMessage = data.submitMessage || undefined
  }
}
