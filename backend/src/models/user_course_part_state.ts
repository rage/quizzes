import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { Course } from "./course"
import { User } from "./user"

@Entity()
export class UserCoursePartState extends BaseEntity {
  @ManyToOne(type => User, user => user.id)
  public user: Promise<User>
  @PrimaryColumn("int") public userId: number

  @ManyToOne(type => Course, course => course.id)
  public course: Promise<Course>
  @PrimaryColumn() public courseId: string

  @Column({ type: "int", primary: true })
  public coursePart: number

  @Column("float") public progress: number
  @Column("float") public score: number
  @Column() public completed: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
