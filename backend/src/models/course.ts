import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Language } from "./language"
import { Organization } from "./organization"

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Organization, org => org.id, { lazy: true })
  public organization: Promise<Organization>

  @ManyToMany(type => Language, lang => lang.id, { lazy: true })
  @JoinTable({ name: "course_language" })
  public languages: Promise<Language[]>

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date
}
