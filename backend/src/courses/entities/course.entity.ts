import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Department, CreditHours, Semester, Level } from 'utils/enum';
import { CoursePrerequisite } from './course-prerequisite.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { InstructorCourse } from 'src/assign-course/entities/assign-course.entity';

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

  @Column({ type: 'enum', enum: CreditHours, default: CreditHours.THREE })
  credit_hours: CreditHours; // 2 | 3 | 4

  @Column({ type: 'enum', enum: Level, default: Level.FIRST })
  level: Level; // 1 → 4

  @Column({ type: 'enum', enum: Semester, default: Semester.FIRST })
  semester: Semester;

  @Column({ type: 'enum', enum: Department, default: Department.GENERAL })
  department: Department;

  @Column({ type: 'int', default: 0, nullable: true })
  min_credit_hours: number;

  @Column({ type: 'float', default: 0, nullable: true })
  min_gpa: number;

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

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => InstructorCourse, (assignment) => assignment.course)
  assignments: InstructorCourse[];
}