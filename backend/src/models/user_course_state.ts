import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm"
import { Course } from "./course"
import { User } from "./user"

@Entity()
export class UserCourseState extends BaseEntity {
  @ManyToOne(type => User, user => user.id, { primary: true })
  public user: Promise<User>
  @ManyToOne(type => Course, course => course.id, { primary: true })
  public course: Promise<Course>

  @Column("float") public progress: number
  @Column("float") public score: number
  @Column() public completed: boolean
  @Column({ type: "timestamp", nullable: true })
  public completionDate: Date

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
