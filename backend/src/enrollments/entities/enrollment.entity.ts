import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { EnrollmentStatus, Semester } from 'utils/enum';

@Entity('enrollments')
@Unique(['student', 'course', 'year', 'semester'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Student, (student) => student.enrollments, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @Index()
  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: Semester })
  semester: Semester;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.IN_PROGRESS,
  })
  status: EnrollmentStatus;

  @Column({ type: 'float', nullable: true })
  grade: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}