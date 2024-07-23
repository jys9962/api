import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'members' })
export class MemberEntity {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  constructor(props: MemberEntity) {
    Object.assign(this, props);
  }
}
