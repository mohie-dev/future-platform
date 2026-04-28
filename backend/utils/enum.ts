export enum Role {
    ADMIN = 'admin',
    STUDENT = 'student',
    INSTRUCTOR = 'instructor',
    CONTROLL_MEMBER = 'control_member'
}

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export enum EnrollmentStatus {
    IN_PROGRESS = 'in_progress',
    PASSED = 'passed',
    FAILED = 'failed',
    FAILED_ABSENT = 'failed_absent',
    WITHDRAWN = 'withdrawn',
    INCOMPLETE = 'incomplete',
    DROPPED = 'dropped',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum HighSchoolType {
    SCIENCE_SECTION = 'science_section',
    MATHEMATICS_SECTION = 'mathematics_section',
    GENERAL_SECTION = 'general_section',
}

export enum Department {
    CS = 'cs',
    IS = 'is',
    IT = 'it',
    GENERAL = 'general'
}

export enum Level {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
}

export enum CreditHours {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
}

export enum Semester {
    FIRST = 1,
    SECOND = 2,
}

export enum Grade {
    A_PLUS = 'A+',
    A = 'A',
    A_MINUS = 'A-',
    B_PLUS = 'B+',
    B = 'B',
    B_MINUS = 'B-',
    C_PLUS = 'C+',
    C = 'C',
    C_MINUS = 'C-',
    D_PLUS = 'D+',
    D = 'D',
    D_MINUS = 'D-',
    F = 'F',
    FX = 'FX',   // رسوب بالغياب
    IC = 'IC',   // Incomplete
    W = 'W', 
}

export enum InstructorRank {
    PROFESSOR = 'professor',
    ASSOCIATE_PROFESSOR = 'associate_professor',
    ASSISTANT_PROFESSOR = 'assistant_professor',
    LECTURER = 'lecturer',
    INSTRUCTOR = 'instructor',
}

export enum InstructorDegree {
    PHD = 'phd',
    MASTERS = 'masters',
    BACHELOR = 'bachelor',
}
