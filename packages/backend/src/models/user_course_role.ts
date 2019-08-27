import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Course } from "./course"
import { User } from "./user"

export type CourseRole = "teacher" | "assistant"

@Entity()
export class UserCourseRole extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => User, user => user.id)
  public user: Promise<User>
  @Column({ nullable: false })
  public userId: number

  @ManyToOne(type => Course, course => course.id)
  public course: Promise<Course>
  @Column({ nullable: false })
  public courseId: string

  @Column({
    type: "varchar",
    nullable: false,
  })
  public role: CourseRole

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
