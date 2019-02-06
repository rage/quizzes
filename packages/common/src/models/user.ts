import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  public id: number

  @CreateDateColumn({ type: "timestamp" })
  public createdAt: Date
  @UpdateDateColumn({ type: "timestamp" })
  public updatedAt: Date

  /* constructor(data?: User) {
    super()

    if (!data) {
      return
    }

    this.id = data.id
  } */
}
