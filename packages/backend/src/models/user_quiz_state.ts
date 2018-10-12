import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { Quiz } from "./quiz"
import { User } from "./user"

@Entity()
export class UserQuizState extends BaseEntity {
  @ManyToOne(type => User, user => user.id)
  public user: Promise<User>
  @PrimaryColumn("int")
  public userId: number

  @ManyToOne(type => Quiz, quiz => quiz.id)
  public quiz: Quiz
  @PrimaryColumn()
  public quizId: string

  @Column({ type: "int", default: 0 })
  public peerReviewsGiven: number
  @Column({ type: "int", default: 0 })
  public peerReviewsReceived: number
  @Column({ type: "int", default: 0 })
  public points: number
  @Column({ type: "int", default: 0 })
  public normalizedPoints: number
  @Column({ type: "int", default: 0 })
  public tries: number
  @Column({ type: "enum", enum: ["open", "locked"], default: "open" })
  public status: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
