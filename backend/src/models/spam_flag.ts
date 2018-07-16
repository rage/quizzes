import { BaseEntity, Column, Entity, ManyToOne } from "typeorm"
import { QuizAnswer } from "./quiz_answer"
import { User } from "./user"

@Entity()
export class SpamFlag extends BaseEntity {
  @ManyToOne(type => User, user => user.id, { primary: true })
  public user: User
  @ManyToOne(type => QuizAnswer, qa => qa.id, { primary: true })
  public quizAnswer: QuizAnswer
}
