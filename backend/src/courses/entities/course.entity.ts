import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Department, Semester } from 'utils/enum';
import { CoursePrerequisite } from './course-prerequisite.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  course_code: string; // CS101

  @Column()
  course_name: string;

  @Column({ nullable: true })
  course_description: string;

  @Column({ type: 'int' })
  credit_hours: number; // 2 | 3 | 4

  @Column({ type: 'int' })
  level: number; // 1 → 4

  @Column({ type: 'enum', enum: Semester })
  semester: Semester;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  // 🔥 relation with prerequisites
  @OneToMany(
    () => CoursePrerequisite,
    (prerequisite) => prerequisite.course,
  )
  prerequisites: CoursePrerequisite[];

  @OneToMany(
    () => CoursePrerequisite,
    (prerequisite) => prerequisite.prerequisite,
  )
  is_prerequisite_for: CoursePrerequisite[];
}