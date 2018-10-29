import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { QuizItem } from "./quiz_item"
import { INewQuizOption, INewQuizOptionTranslation } from "../types"

@Entity()
export class QuizOption extends BaseEntity {
  constructor(data?: QuizOption) {
    super()

    if (!data) {
      return
    }

    if (data.id) {
      this.id = data.id
    }
    if (data.quizItemId) {
      this.quizItemId = data.quizItemId
    }
    this.order = data.order
    this.correct = data.correct

    if (data.texts) {
      this.texts = data.texts.map((text: QuizOptionTranslation) => {
        const qot = new QuizOptionTranslation(text)
        qot.quizOptionId = data.id

        return qot
      })
    }
  }

  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => QuizItem, qi => qi.id)
  public quizItem: Promise<QuizItem> | QuizItem
  @Column({ nullable: true })
  public quizItemId: string | null

  @Column("int")
  public order: number

  @OneToMany(type => QuizOptionTranslation, qot => qot.quizOption, {
    eager: true,
  })
  public texts: QuizOptionTranslation[]

  @Column()
  public correct: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizOptionTranslation extends BaseEntity {
  constructor(data?: QuizOptionTranslation) {
    super()

    if (!data) {
      return
    }

    if (data.quizOptionId) {
      this.quizOptionId = data.quizOptionId
    }

    this.languageId = data.languageId
    this.title = data.title
    this.body = data.body
    this.successMessage = data.successMessage
    this.failureMessage = data.failureMessage
  }

  @ManyToOne(type => QuizOption, qo => qo.id)
  public quizOption: Promise<QuizOption>
  @PrimaryColumn()
  public quizOptionId: string

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column({ type: "text", default: "" })
  public title: string
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
