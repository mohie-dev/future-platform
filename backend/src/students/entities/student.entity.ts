import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department, HighSchoolType, Level, Semester } from 'utils/enum';

@Entity({ name: 'students' })
export class Student {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({ unique: true })
  student_code: string;

  @Column({
    type: 'enum',
    enum: Department,
    nullable: false,
    default: Department.CS,
  })
  department: Department;

  @Column({
    type: 'enum',
    enum: Level,
    nullable: false,
    default: Level.FIRST,
  })
  level: Level;

  @Column({
    type: 'enum',
    enum: Semester,
    nullable: false,
    default: Semester.FIRST,
  })
  semester: Semester;

  @Column({ default: 0 })
  completed_credit_hours: number;

  @Column({ type: 'float', default: 0 })
  gpa: number;

  @Column({ type: 'date' })
  enrollment_date: Date;

  @Column({ type: 'enum', enum: HighSchoolType, nullable: false })
  high_school_type: HighSchoolType;

  @Column({ type: 'float', nullable: false })
  high_school_score: number;

  @Column({ type: 'float', nullable: false })
  high_school_degree: number;

  @Column({ nullable: false })
  high_school_year: number;

  @Column({ nullable: true })
  notes: string;
}
