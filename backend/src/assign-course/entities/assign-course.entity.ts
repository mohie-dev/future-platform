import { Course } from "src/courses/entities/course.entity";
import { Instructor } from "src/instructors/entities/instructor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn,  } from "typeorm";
import { Semester } from "utils/enum";

@Entity('instructor_courses')
export class InstructorCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Instructor, (instructor) => instructor.assignments, {
    onDelete: 'CASCADE',
  })
  instructor: Instructor;

  @ManyToOne(() => Course, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'enum', enum: Semester, nullable: true })
  semester: Semester;
}