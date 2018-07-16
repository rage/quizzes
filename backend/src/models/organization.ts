import { BaseEntity, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Organization extends BaseEntity {
  @PrimaryColumn() public id: number
}
