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
  @ManyToOne(type => User, user => user.id, { primary: true })
  public user: Promise<User>
  @PrimaryColumn("int") public userId: number

  @ManyToOne(type => Quiz, quiz => quiz.id, { primary: true })
  public quiz: Quiz
  @PrimaryColumn() public quizId: string

  @Column("int") public peerReviewsGiven: number
  @Column("int") public peerReviewsReceived: number
  @Column("int") public points: number
  @Column("int") public normalizedPoints: number
  @Column("int") public tries: number
  @Column({ type: "enum", enum: ["open", "locked"] })
  public status: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
