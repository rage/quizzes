import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { getUUIDByString, randomUUID } from "../util"
import { Language } from "./language"
import { Quiz } from "./quiz"
import { QuizItemAnswer } from "./quiz_item_answer"
import { User } from "./user"

@Entity()
export class QuizAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Quiz
  @Column()
  public quizId: string
  @ManyToOne(type => User, user => user.id, { cascade: true })
  public user: User
  @Column("int")
  public userId: number

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @Column()
  public languageId: string

  @Column({
    type: "enum",
    enum: ["draft", "submitted", "spam", "confirmed", "rejected", "deprecated"],
  })
  public status: string

  @OneToMany(type => QuizItemAnswer, qi => qi.quizAnswer, {
    eager: true,
    cascade: true,
  })
  public itemAnswers: QuizItemAnswer[]

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: QuizAnswer) {
    super()

    if (!data) {
      return
    }

    this.quizId = data.quizId
    this.userId = data.userId
    this.languageId = data.languageId
    this.status = data.status
    this.itemAnswers = data.itemAnswers
  }

  @BeforeInsert()
  private addRelations() {
    this.id = this.id || randomUUID()

    if (this.itemAnswers) {
      this.itemAnswers.forEach(
        (itemAnswer: QuizItemAnswer) => (itemAnswer.quizAnswerId = this.id),
      )
    }
  }
}
