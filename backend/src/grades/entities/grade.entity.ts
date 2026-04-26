import { Enrollment } from "src/enrollments/entities/enrollment.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Grade as GradeEnum } from "utils/enum";


@Entity('grades')
export class Grade {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Enrollment, { onDelete: 'CASCADE' })
    @JoinColumn()
    enrollment: Enrollment;

    @Column({ type: 'float', nullable: true })
    coursework: number;

    @Column({ type: 'float', nullable: true })
    midterm: number;

    @Column({ type: 'float', nullable: true })
    final: number;

    @Column({ type: 'float', default: 0 })
    total: number;

    @Column({ type: 'float', default: 0 })
    point: number;

    @Column({ type: 'enum', enum: GradeEnum, nullable: true })
    grade: GradeEnum;

    @Column({ default: false })
    is_finalized: boolean;
}