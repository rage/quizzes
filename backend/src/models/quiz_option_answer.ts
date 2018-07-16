import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { QuizItemAnswer } from "./quiz_item_answer"
import { QuizOption } from "./quiz_option"

@Entity()
export class QuizOptionAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => QuizItemAnswer, qia => qia.id)
  public quizItemAnswer: QuizItemAnswer
  @ManyToOne(type => QuizOption, qo => qo.id)
  public quizOption: QuizOption
}
