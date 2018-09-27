import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { Organization } from "./organization"

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Organization, org => org.id)
  public organization: Organization
  @RelationId((course: Course) => course.organization)
  public organizationId: number

  @ManyToMany(type => Language, lang => lang.id, { eager: true })
  @JoinTable({ name: "course_language" })
  public languages: Language[]

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
