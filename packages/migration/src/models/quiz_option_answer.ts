import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { QuizItemAnswer } from "./quiz_item_answer"
import { QuizOption } from "./quiz_option"

@Entity()
export class QuizOptionAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => QuizItemAnswer, qia => qia.id)
  public quizItemAnswer: QuizItemAnswer
  @Column()
  public quizItemAnswerId: string

  @ManyToOne(type => QuizOption, qo => qo.id)
  public quizOption: QuizOption
  @Column()
  public quizOptionId: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
