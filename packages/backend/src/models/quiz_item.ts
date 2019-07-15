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
import { randomUUID } from "../util"
import { Language } from "./language"
import { Quiz } from "./quiz"
import { QuizOption } from "./quiz_option"

@Entity()
export class QuizItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id, { onDelete: "CASCADE" })
  @JoinColumn()
  public quiz: Promise<Quiz>
  @Column({ nullable: true })
  public quizId: string | null

  @Column({
    type: "enum",
    enum: [
      "open",
      "scale",
      "essay",
      "multiple-choice",
      "checkbox",
      "research-agreement",
      "feedback",
      "custom-frontend-accept-data",
    ],
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
    eager: false,
    cascade: true,
  })
  public options: QuizOption[]

  @Column({ type: "smallint", nullable: true, select: false })
  public minWords?: number

  @Column({ type: "smallint", nullable: true, select: false })
  public maxWords?: number

  @Column({ type: "smallint", nullable: true, select: false })
  public minValue?: number

  @Column({ type: "smallint", nullable: true, select: false })
  public maxValue?: number

  @Column({ nullable: true, select: false })
  public validityRegex?: string
  @Column({ nullable: true })
  public formatRegex?: string
  @Column({ nullable: true, default: false })
  public multi?: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: QuizItem) {
    super()

    if (!data) {
      return
    }

    if (data.quizId) {
      this.quizId = data.quizId
    }
    this.type = data.type
    this.order = data.order
    this.validityRegex = data.validityRegex
    this.formatRegex = data.formatRegex
    this.texts = data.texts
    this.options = data.options
    this.minWords = data.minWords
    this.maxWords = data.maxWords
  }

  @BeforeInsert()
  private addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach(
        (text: QuizItemTranslation) => (text.quizItemId = this.id),
      )
    }
    if (this.options) {
      this.options.forEach(
        (option: QuizOption) => (option.quizItemId = this.id),
      )
    }
  }
}

@Entity()
export class QuizItemTranslation extends BaseEntity {
  @ManyToOne(type => QuizItem, qi => qi.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  public quizItem: Promise<QuizItem>
  @PrimaryColumn()
  public quizItemId: string | undefined

  @ManyToOne(type => Language, lang => lang.id)
  @JoinColumn()
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column({ type: "text", nullable: true })
  public title?: string
  @Column({ type: "text", nullable: true })
  public body?: string

  @Column({ type: "text", nullable: true })
  public minLabel?: string

  @Column({ type: "text", nullable: true })
  public maxLabel?: string

  @Column({ type: "text", nullable: true, select: false })
  public successMessage?: string
  @Column({ type: "text", nullable: true, select: false })
  public failureMessage?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

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
    this.minLabel = data.minLabel
    this.maxLabel = data.maxLabel
  }
}
