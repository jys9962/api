import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('categories')
@Index('idx_categories_board_id')
export class CategoryEntity {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'bigint', unsigned: true, comment: 'boards.id' })
  boardId!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
