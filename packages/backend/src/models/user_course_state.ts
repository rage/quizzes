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
import { Course } from "./course"
import { User } from "./user"

@Entity()
export class UserCourseState extends BaseEntity {
  @ManyToOne(type => User, user => user.id)
  public user: Promise<User>
  @PrimaryColumn("int")
  public userId: number

  @ManyToOne(type => Course, course => course.id)
  public course: Promise<Course>
  @PrimaryColumn()
  public courseId: string

  @Column({ type: "float", default: 0 })
  public progress: number
  @Column({ type: "float", default: 0 })
  public score: number
  @Column({ type: "boolean", default: false })
  public completed: boolean
  @Column({ type: "timestamp", nullable: true })
  public completionDate?: Date
  @Column({ type: "timestamp", nullable: true })
  public completionAnswersDate?: Date

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
