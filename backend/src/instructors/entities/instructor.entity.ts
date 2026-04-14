import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department } from 'utils/enum';

@Entity({ name: 'instructors' })
export class Instructor {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({ unique: true })
  instructor_code: string;

  @Column({
    type: 'enum',
    enum: Department,
    nullable: false,
    default: Department.CS,
  })
  department: Department;

  @Column({ nullable: true })
  notes: string;
}