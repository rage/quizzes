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
import { Course } from "./course"
import { Language } from "./language"
import { PeerReviewQuestion } from "./peer_review_question"
import { QuizItem } from "./quiz_item"

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Course, course => course.id, { eager: true })
  public course: Course
  @Column() public courseId: string

  @OneToMany(type => QuizTranslation, qt => qt.quiz, { eager: true })
  public texts: QuizTranslation[]

  @Column("int") public part: number
  @Column({ type: "int", nullable: true })
  public section?: number

  @Column({ type: "timestamp", nullable: true })
  public deadline?: Date
  @Column({ type: "timestamp", nullable: true })
  public open?: Date

  @OneToMany(type => QuizItem, qi => qi.quiz)
  public items: Promise<QuizItem[]>

  @OneToMany(type => PeerReviewQuestion, prq => prq.quiz)
  public peerReviewQuestions: Promise<PeerReviewQuestion[]>

  @Column({ default: false })
  public excludedFromScore: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}

@Entity()
export class QuizTranslation extends BaseEntity {
  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Promise<Quiz>
  @PrimaryColumn() public quizId: string

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @PrimaryColumn() public languageId: string

  @Column("text") public title: string
  @Column("text") public body: string
  @Column({ type: "text", nullable: true })
  public submitMessage: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
