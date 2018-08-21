import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm"
import { QuizAnswer } from "./quiz_answer"
import { User } from "./user"

@Entity()
export class SpamFlag extends BaseEntity {
  @ManyToOne(type => User, user => user.id, { primary: true })
  public user: Promise<User>
  @ManyToOne(type => QuizAnswer, qa => qa.id, { primary: true })
  public quizAnswer: Promise<QuizAnswer>

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
