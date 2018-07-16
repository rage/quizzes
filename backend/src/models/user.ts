import { BaseEntity, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn() public id: number
}
