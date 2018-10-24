import {
  BaseEntity,
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
import { getUUIDByString } from "../util"
@Entity()
export class Quiz extends BaseEntity {
  constructor(data: INewQuizQuery = {} as INewQuizQuery) {
    super()

    if (!data) {
      return
    }

    this.courseId = data.courseId || getUUIDByString("default")
    this.part = data.part || 0
    this.section = data.section || 0
    this.deadline = data.deadline
    this.open = data.open

    if (data.texts) {
      this.save().then(
        (newQuiz: Quiz) =>
          (this.texts = data.texts.map(
            (text: INewQuizTranslation) =>
              new QuizTranslation({ ...text, quiz: newQuiz }),
          )),
      )
    }

    if (data.items) {
      this.items = Promise.all(
        data.items.map(
          (item: INewQuizItem) => new QuizItem({ ...item, quiz: this }),
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

  @OneToMany(type => QuizTranslation, qt => qt.quiz, { eager: true })
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
}

@Entity()
export class QuizTranslation extends BaseEntity {
  constructor(data: INewQuizTranslation = {} as INewQuizTranslation) {
    super()

    if (!data) {
      return
    }

    console.log("translation constructor received", data)

    this.quizId = data.quizId
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
