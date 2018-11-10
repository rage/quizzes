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
  UpdateDateColumn,
} from "typeorm"
import { INewQuizOption, INewQuizOptionTranslation } from "../types"
import { randomUUID } from "../util"
import { Language } from "./language"
import { QuizItem } from "./quiz_item"

@Entity()
export class QuizOption extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => QuizItem, qi => qi.id)
  public quizItem: Promise<QuizItem>
  @Column({ nullable: true })
  public quizItemId: string | null

  @Column("int")
  public order: number

  @OneToMany(type => QuizOptionTranslation, qot => qot.quizOption, {
    eager: true,
    cascade: true,
  })
  public texts: QuizOptionTranslation[]

  @Column()
  public correct: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: QuizOption) {
    super()

    if (!data) {
      return
    }

    if (data.quizItemId) {
      this.quizItemId = data.quizItemId
    }
    this.order = data.order
    this.correct = data.correct
    this.texts = data.texts
  }

  @BeforeInsert()
  public addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach(
        (text: QuizOptionTranslation) => (text.quizOptionId = this.id),
      )
    }
  }
}

@Entity()
export class QuizOptionTranslation extends BaseEntity {
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
}
