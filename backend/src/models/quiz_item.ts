import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { Quiz } from "./quiz"

@Entity()
export class QuizItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Quiz

  @Column({ type: "enum", enum: ["open", "essay", "multiple-choice"] })
  public type: string
  @Column("int") public order: number

  @OneToMany(type => QuizItemTranslation, qit => qit.quizItem)
  public texts: QuizItemTranslation[]

  @Column() public validityRegex: string
  @Column() public formatRegex: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizItemTranslation extends BaseEntity {
  @ManyToOne(type => QuizItem, qi => qi.id, { primary: true })
  public quizItem: string
  @ManyToOne(type => Language, lang => lang.id, { primary: true })
  public language: Language

  @Column("text") public title: string
  @Column("text") public body: string

  @Column("text") public successMessage: string
  @Column("text") public failureMessage: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
