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
import { QuizItem } from "./quiz_item"

@Entity()
export class QuizOption extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => QuizItem, qi => qi.id)
  public quizItem: QuizItem

  @Column("int") public order: number

  @OneToMany(type => QuizOptionTranslation, qot => qot.quizOption)
  public texts: QuizOptionTranslation[]

  @Column() public correct: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizOptionTranslation extends BaseEntity {
  @ManyToOne(type => QuizOption, qo => qo.id, { primary: true })
  public quizOption: string
  @ManyToOne(type => Language, lang => lang.id, { primary: true })
  public language: Language

  @Column("text") public title: string
  @Column({ type: "text", nullable: true })
  public body?: string

  @Column("text") public successMessage: string
  @Column("text") public failureMessage: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
