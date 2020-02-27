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
  public user: User
  @PrimaryColumn("int")
  public userId: number

  @ManyToOne(type => Course, course => course.id)
  public course: Course
  @PrimaryColumn()
  public courseId: string

  @Column({ type: "int", primary: true })
  public coursePart: number

  @Column({ type: "double precision", default: 0 })
  public progress: number
  @Column({ type: "double precision", default: 0 })
  public score: number
  @Column({ type: "boolean", default: false })
  public completed: boolean

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
