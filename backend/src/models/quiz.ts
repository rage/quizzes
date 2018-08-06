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
import { Course } from "./course"
import { Language } from "./language"

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Course, course => course.id)
  public course: Course

  @OneToMany(type => QuizTranslation, qt => qt.quiz)
  public texts: QuizTranslation[]

  @Column("int") public part: number
  @Column({ type: "int", nullable: true })
  public section?: number

  @Column({ type: "timestamp", nullable: true })
  public deadline?: Date
  @Column({ type: "timestamp", nullable: true })
  public open?: Date

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizTranslation extends BaseEntity {
  @ManyToOne(type => Quiz, quiz => quiz.id, { primary: true })
  public quiz: string
  @ManyToOne(type => Language, lang => lang.id, { primary: true })
  public language: Language

  @Column("text") public title: string
  @Column("text") public body: string
  @Column("text") public submitMessage: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
