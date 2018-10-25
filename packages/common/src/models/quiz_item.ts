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
import {
  INewQuizItem,
  INewQuizItemTranslation,
  INewQuizOption,
  INewQuizOptionTranslation,
} from "../types"
import { Language } from "./language"
import { Quiz } from "./quiz"
import { QuizOption } from "./quiz_option"

@Entity()
export class QuizItem extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @Column()
  public quizId: string

  @Column({
    type: "enum",
    enum: ["open", "scale", "essay", "radio", "checkbox", "research-agreement"],
  })
  public type: string
  @Column("int")
  public order: number

  @OneToMany(type => QuizItemTranslation, qit => qit.quizItem, { eager: true })
  public texts: QuizItemTranslation[]

  @OneToMany(type => QuizOption, qo => qo.quizItem, { eager: true }) // was: not eager
  public options: Promise<QuizOption[]>

  @Column({ nullable: true })
  public validityRegex?: string
  @Column({ nullable: true })
  public formatRegex?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data: INewQuizItem = {} as INewQuizItem) {
    super()

    if (!data) {
      return
    }

    this.type = data.type
    this.order = data.order
    this.validityRegex = data.validityRegex
    this.formatRegex = data.formatRegex

    if (data.texts) {
      this.texts = data.texts.map(
        (text: INewQuizItemTranslation) =>
          new QuizItemTranslation({ ...text, quizItem: this }),
      )
    }
    if (data.options) {
      this.options = Promise.all(
        data.options.map(
          (option: INewQuizOption) =>
            new QuizOption({ ...option, quizItem: this }),
        ),
      )
    }
  }


}

@Entity()
export class QuizItemTranslation extends BaseEntity {

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

  constructor(data: INewQuizItemTranslation = {} as INewQuizItemTranslation) {
    super()

    if (!data) {
      return
    }

    this.languageId = data.languageId
    this.title = data.title
    this.body = data.body
    this.successMessage = data.successMessage
    this.failureMessage = data.failureMessage
  }
}
