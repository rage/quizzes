import { BaseEntity, Column, Entity, ManyToOne } from "typeorm"
import { Quiz } from "./quiz"
import { User } from "./user"

@Entity()
export class UserQuizState extends BaseEntity {
  @ManyToOne(type => User, user => user.id, { primary: true })
  public user: User
  @ManyToOne(type => Quiz, quiz => quiz.id, { primary: true })
  public quiz: Quiz

  @Column("int") public peerReviewsGiven: number
  @Column("int") public peerReviewsReceived: number
  @Column("int") public points: number
  @Column("int") public normalizedPoints: number
  @Column("int") public tries: number
  @Column({ type: "enum", enum: ["open", "locked"] })
  public status: string
}
