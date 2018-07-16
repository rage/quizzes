import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Language extends BaseEntity {
  @PrimaryColumn() public id: string

  @Column() public country: string

  @Column() public name: string
}
