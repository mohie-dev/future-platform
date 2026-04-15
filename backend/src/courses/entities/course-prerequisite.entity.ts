import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('course_prerequisites')
@Unique(['course', 'prerequisite'])
export class CoursePrerequisite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Course, (course) => course.prerequisites, {
        onDelete: 'CASCADE',
    })
    course: Course;

    @ManyToOne(() => Course, (course) => course.is_prerequisite_for, {
        onDelete: 'CASCADE',
    })
    prerequisite: Course;
}