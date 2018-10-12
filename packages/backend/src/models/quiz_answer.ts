import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { Quiz } from "./quiz"
import { User } from "./user"

@Entity()
export class QuizAnswer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Quiz
  @ManyToOne(type => User, user => user.id)
  public user: User

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language

  @Column({
    type: "enum",
    enum: ["draft", "submitted", "spam", "confirmed", "rejected", "deprecated"],
  })
  public status: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
