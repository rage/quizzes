import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { QuizAnswer } from "./quiz_answer"
import { User } from "./user"

@Entity()
export class SpamFlag extends BaseEntity {
  @ManyToOne(type => User, user => user.id)
  public user: Promise<User>
  @PrimaryColumn("int")
  public userId: number

  @ManyToOne(type => QuizAnswer, qa => qa.id)
  public quizAnswer: Promise<QuizAnswer>
  @PrimaryColumn()
  public quizAnswerId: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
