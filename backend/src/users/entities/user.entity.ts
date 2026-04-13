import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role, Status, Gender } from 'utils/enum';

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

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column({ type: 'enum', enum: Role, nullable: false, default: Role.STUDENT })
  role: Role;

  @Column({ type: 'varchar', length: '150', nullable: true })
  password_hash: string | null;

  @Column({ type: 'boolean', default: false })
  is_password_set: boolean;

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
