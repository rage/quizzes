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
import { Language } from "./language"
import { Quiz } from "./quiz"
import { QuizOption } from "./quiz_option"
import {
  INewQuizItem,
  INewQuizItemTranslation,
  INewQuizOption,
  INewQuizOptionTranslation,
} from "../types"
import { randomUUID } from "../util"

@Entity()
export class QuizItem extends BaseEntity {
  constructor(data?: QuizItem) {
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
    if (data.id) {
      this.id = data.id
    }
    this.type = data.type
    this.order = data.order
    this.validityRegex = data.validityRegex
    this.formatRegex = data.formatRegex

    if (data.texts) {
      this.texts = data.texts.map((text: QuizItemTranslation) => {
        const qit = new QuizItemTranslation(text)
        qit.quizItemId = this.id

        return qit
      })
    }
    if (data.options) {
      this.options = data.options.then((options: QuizOption[]) =>
        Promise.all(
          options.map((option: QuizOption) => {
            const qo = new QuizOption(option)
            qo.quizItemId = this.id
            qo.id = randomUUID()

            return qo
          }),
        ),
      )
    }
  }

  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz> | Quiz
  @Column()
  public quizId: string

  @Column({
    type: "enum",
    enum: ["open", "scale", "essay", "radio", "checkbox", "research-agreement"],
  })
  public type: string
  @Column("int")
  public order: number

  @OneToMany(type => QuizItemTranslation, qit => qit.quizItem, {
    eager: true,
    cascade: true,
  })
  public texts: QuizItemTranslation[]

  @OneToMany(type => QuizOption, qo => qo.quizItem, {
    eager: true,
    cascade: true,
  }) // was: not eager
  public options: Promise<QuizOption[]>

  @Column({ nullable: true })
  public validityRegex?: string
  @Column({ nullable: true })
  public formatRegex?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizItemTranslation extends BaseEntity {
  constructor(data?: QuizItemTranslation) {
    super()

    if (!data) {
      return
    }

    if (data.quizItemId) {
      this.quizItemId = data.quizItemId
    }

    this.languageId = data.languageId
    this.title = data.title
    this.body = data.body
    this.successMessage = data.successMessage
    this.failureMessage = data.failureMessage
  }

  @ManyToOne(type => QuizItem, qi => qi.id)
  public quizItem: Promise<QuizItem>
  @PrimaryColumn()
  public quizItemId: string

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column({ type: "text", nullable: true })
  public title?: string
  @Column({ type: "text", nullable: true })
  public body?: string

  @Column({ type: "text", nullable: true })
  public successMessage?: string
  @Column({ type: "text", nullable: true })
  public failureMessage?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
