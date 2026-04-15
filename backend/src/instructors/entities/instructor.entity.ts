import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn, OneToMany, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department, InstructorDegree, InstructorRank } from 'utils/enum';
import { Course } from 'src/courses/entities/course.entity';
import { InstructorCourse } from 'src/assign-course/entities/assign-course.entity';

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
    enum: InstructorRank,
    nullable: true,
    default: InstructorRank.LECTURER,
  })
  instructor_rank: InstructorRank;

  @Column({ type: 'enum', enum: InstructorDegree, nullable: true })
  instructor_degree: InstructorDegree;

  @Column({
    type: 'enum',
    enum: Department,
    nullable: false,
    default: Department.CS,
  })
  department: Department;

  @OneToMany(() => InstructorCourse, (ic) => ic.instructor)
  assignments: InstructorCourse[];

  @Column({ nullable: true })
  notes: string;
}