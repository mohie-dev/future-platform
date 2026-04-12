import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role, Status } from 'utils/enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '150', nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: '150', unique: true })
  email: string;

  @Column({ type: 'varchar', length: '150', nullable: false })
  phone: string;

  @Column({
    type: 'varchar',
    length: '150',
    nullable: false,
    default: 'Mansoura',
  })
  address: string;

  @Column({ type: 'enum', enum: Role, nullable: false, default: Role.STUDENT })
  role: Role;

  @Column({ type: 'varchar', length: '150', nullable: false })
  password_hash: string;

  @Column({ type: 'varchar', length: '150', nullable: false })
  national_id: string;

  @Column({
    type: 'enum',
    enum: Status,
    nullable: false,
    default: Status.ACTIVE,
  })
  status: Status;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
