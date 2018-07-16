import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { QuizAnswer } from "./quiz_answer"
import { QuizItem } from "./quiz_item"

@Entity()
export class QuizItemAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => QuizAnswer, qa => qa.id)
  public quizAnswer: QuizAnswer
  @ManyToOne(type => QuizItem, qi => qi.id)
  public quizItem: QuizItem

  @Column("text") public textData: string
}
