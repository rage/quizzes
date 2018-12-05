import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm"
import { getUUIDByString, randomUUID } from "../util"
import { Language } from "./language"
import { Organization } from "./organization"

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ManyToOne(type => Organization, org => org.id, { eager: true })
  public organization: Organization
  @RelationId((course: Course) => course.organization)
  public organizationId: number

  @ManyToMany(type => Language, lang => lang.id, { eager: true })
  @JoinTable({ name: "course_language" })
  public languages: Language[]

  @OneToMany(type => CourseTranslation, ct => ct.course, {
    eager: true,
    cascade: true,
  })
  public texts: CourseTranslation[]

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: Course) {
    super()

    if (!data) {
      return
    }

    this.organizationId = data.organizationId
    this.languages = data.languages
    this.texts = data.texts
  }

  @BeforeInsert()
  private addRelations() {
    this.id = this.id || randomUUID()

    if (this.texts) {
      this.texts.forEach((text: CourseTranslation) => (text.courseId = this.id))
    }
  }
}

@Entity()
export class CourseTranslation extends BaseEntity {
  @ManyToOne(type => Course, course => course.id)
  public course: Promise<Course>
  @PrimaryColumn()
  public courseId: string

  @ManyToOne(type => Language, lang => lang.id)
  public language: Language
  @PrimaryColumn()
  public languageId: string

  @Column({ type: "text", default: "" })
  public abbreviation: string
  @Column({ type: "text", default: "" })
  public title: string
  @Column({ type: "text", default: "" })
  public body: string

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  constructor(data?: CourseTranslation) {
    super()

    if (!data) {
      return
    }

    if (data.courseId) {
      this.courseId = data.courseId
    }
    this.languageId = data.languageId || "unknown"
    this.abbreviation = data.abbreviation
    this.title = data.title
    this.body = data.body
  }
}
