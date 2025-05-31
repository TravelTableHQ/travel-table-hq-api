import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_user' })
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'name',
    comment: '이름',
  })
  name!: string;

  @Column({
    type: 'char',
    length: 1,
    name: 'gender',
    comment: '성별 (M: 남 / F: 여)',
  })
  gender!: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
    comment: '생성일시',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at',
    comment: '수정일시',
  })
  updatedAt!: Date | null;
}
