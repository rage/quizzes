import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { QuizAnswer } from "./quiz_answer"
import { QuizItem } from "./quiz_item"
import { QuizOptionAnswer } from "./quiz_option_answer"

@Entity()
export class QuizItemAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => QuizAnswer, qa => qa.id)
  public quizAnswer: Promise<QuizAnswer>
  @Column()
  public quizAnswerId: string

  @ManyToOne(type => QuizItem, qi => qi.id)
  public quizItem: Promise<QuizItem>
  @Column()
  public quizItemId: string

  @Column({ type: "text", nullable: true })
  public textData: string
  @Column({ type: "int", nullable: true })
  public intData: number

  @OneToMany(type => QuizOptionAnswer, qoa => qoa.quizItemAnswer, {
    lazy: true,
  })
  public options: Promise<QuizOptionAnswer[]>

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
