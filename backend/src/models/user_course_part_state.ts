import { BaseEntity, Column, Entity, ManyToOne } from "typeorm"
import { Course } from "./course"
import { User } from "./user"

@Entity()
export class UserCoursePartState extends BaseEntity {
  @ManyToOne(type => User, user => user.id, { primary: true })
  public user: User
  @ManyToOne(type => Course, course => course.id, { primary: true })
  public course: Course
  @Column({ type: "int", primary: true })
  public coursePart: number

  @Column("float") public progress: number
  @Column("float") public score: number
  @Column() public completed: boolean
}
