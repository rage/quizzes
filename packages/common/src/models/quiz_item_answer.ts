import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { randomUUID } from "../util"
import { QuizAnswer } from "./quiz_answer"
import { QuizItem } from "./quiz_item"
import { QuizOptionAnswer } from "./quiz_option_answer"

@Entity()
export class QuizItemAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(
    type => QuizAnswer,
    qa => qa.id,
  )
  @JoinColumn()
  public quizAnswer: Promise<QuizAnswer>
  @Column({ nullable: true })
  public quizAnswerId: string | null

  @ManyToOne(
    type => QuizItem,
    qi => qi.id,
  )
  // @JoinColumn()
  public quizItem: Promise<QuizItem>
  @Column()
  public quizItemId: string

  @Column({ type: "text", nullable: true })
  public textData: string
  @Column({ type: "int", nullable: true })
  public intData: number
  @Column({ type: "boolean", nullable: true })
  public correct: boolean

  @OneToMany(
    type => QuizOptionAnswer,
    qoa => qoa.quizItemAnswer,
    {
      eager: true,
      cascade: true,
    },
  )
  public optionAnswers: QuizOptionAnswer[]

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: QuizItemAnswer) {
    super()

    if (!data) {
      return
    }

    if (data.quizAnswerId) {
      this.quizAnswerId = data.quizAnswerId
    }
    this.quizItemId = data.quizItemId
    this.textData = data.textData
    this.intData = data.intData
    this.optionAnswers = data.optionAnswers
  }

  @BeforeInsert()
  private addRelations() {
    this.id = this.id || randomUUID()

    if (this.optionAnswers) {
      this.optionAnswers.forEach(
        (option: QuizOptionAnswer) => (option.quizItemAnswerId = this.id),
      )
    }
  }
}
