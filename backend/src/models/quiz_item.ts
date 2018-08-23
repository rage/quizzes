import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { Quiz } from "./quiz"
import { QuizOption } from "./quiz_option"

@Entity()
export class QuizItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @Column() public quizId: string

  @Column({ type: "enum", enum: ["open", "essay", "multiple-choice"] })
  public type: string
  @Column("int") public order: number

  @OneToMany(type => QuizItemTranslation, qit => qit.quizItem, { eager: true })
  public texts: QuizItemTranslation[]

  @OneToMany(type => QuizOption, qo => qo.quizItem)
  public options: Promise<QuizOption[]>

  @Column({ nullable: true })
  public validityRegex?: string
  @Column({ nullable: true })
  public formatRegex?: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizItemTranslation extends BaseEntity {
  @ManyToOne(type => QuizItem, qi => qi.id)
  public quizItem: Promise<QuizItem>
  @PrimaryColumn() public quizItemId: string

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @PrimaryColumn() public languageId: string

  @Column("text") public title: string
  @Column("text") public body: string

  @Column("text") public successMessage: string
  @Column("text") public failureMessage: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
