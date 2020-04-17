import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { Quiz } from "./quiz"
import { User } from "./user"

@Entity()
export class UserQuizState extends BaseEntity {
  @ManyToOne(
    type => User,
    user => user.id,
  )
  public user: Promise<User>
  @PrimaryColumn("int")
  public userId: number

  @ManyToOne(
    type => Quiz,
    quiz => quiz.id,
  )
  public quiz: Quiz
  @Index()
  @PrimaryColumn()
  public quizId: string

  @Column({ type: "int", nullable: true })
  public peerReviewsGiven: number
  @Column({ type: "int", nullable: true })
  public peerReviewsReceived: number
  @Column({ type: "double precision", nullable: true })
  public pointsAwarded: number
  @Column({ type: "int", nullable: true })
  public spamFlags: number
  @Column({ type: "int", default: 0 })
  public tries: number
  @Column({ type: "enum", enum: ["open", "locked"], default: "open" })
  public status: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
