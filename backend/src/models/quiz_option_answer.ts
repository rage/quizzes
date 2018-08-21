import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { QuizItemAnswer } from "./quiz_item_answer"
import { QuizOption } from "./quiz_option"

@Entity()
export class QuizOptionAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => QuizItemAnswer, qia => qia.id)
  public quizItemAnswer: Promise<QuizItemAnswer>
  @ManyToOne(type => QuizOption, qo => qo.id)
  public quizOption: Promise<QuizOption>

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
