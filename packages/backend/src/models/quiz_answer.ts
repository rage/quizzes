import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

type QuizAnswerStatusType =
  | "draft"
  | "given-more-than-enough"
  | "given-enough"
  | "manual-review-once-given-and-received-enough"
  | "manual-review-once-given-enough"
  | "submitted"
  | "manual-review"
  | "confirmed"
  | "enough-received-but-not-given"
  | "spam"
  | "rejected"
  | "deprecated"

@Entity()
export class QuizAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(
    type => Quiz,
    quiz => quiz.id,
  )
  public quiz: Quiz
  @Index()
  @Column()
  public quizId: string
  @ManyToOne(
    type => User,
    user => user.id,
    { cascade: true },
  )
  public user?: User
  @Index()
  @Column({ type: "int", nullable: true })
  public userId: number

  @ManyToOne(
    type => Language,
    lang => lang.id,
  )
  public language: Language
  @Index()
  @Column()
  public languageId: string

  @Index()
  @Column({
    type: "enum",
    enum: [
      "draft",
      "given-more-than-enough",
      "given-enough",
      "manual-review-once-given-and-received-enough",
      "manual-review-once-given-enough",
      "submitted",
      "manual-review",
      "confirmed",
      "enough-received-but-not-given",
      "spam",
      "rejected",
      "deprecated",
    ],
  })
  public status?: QuizAnswerStatusType

  @OneToMany(
    type => QuizItemAnswer,
    qi => qi.quizAnswer,
    {
      eager: true,
      cascade: true,
    },
  )
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
