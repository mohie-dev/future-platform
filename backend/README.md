# Future Platform - Backend

This is the backend service for the **Student Information System (SIS)** built with [NestJS](https://nestjs.com/). It provides a robust API for managing academic data, user authentication, and grading logic.

## Key Features

- **RBAC (Role-Based Access Control)**: Secured endpoints for Students, Instructors, and Admins.
- **Automated Grading**: Logic for calculating total marks, letter grades, and grade points.
- **GPA Engine**: Real-time calculation of Semester GPA and Cumulative GPA (CGPA).
- **Rate Limiting**: Integrated throttler to prevent API abuse.
- **Transaction Safety**: Atomic operations for complex data creation (e.g., creating a student with a linked user).

## Prerequisites

- **Node.js**: v18 or higher
- **Package Manager**: npm
- **Database**: PostgreSQL

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   $ npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the `backend` directory:
   ```env
   # Database Configuration
   ## Localhost
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_db_password
   DB_NAME=future-platform-db

   ## OR
   
   DATABASE_URL="URL_HERE"

   # JWT Security
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   ```

3. **Run the Application**:
   ```bash
   # Development mode
   $ npm run start:dev

   # Production mode
   $ npm run start:prod
   ```

## Module Architecture

The backend is organized into domain-driven modules:

- **`users`**: Handles authentication, profile management, and the "First Login" password setup flow.
- **`students`**: Manages student-specific data, levels, departments, and academic dashboards.
- **`instructors`**: Management of instructor profiles and course assignments.
- **`courses`**: The academic catalog, including credit hours and course metadata.
- **`enrollments`**: Manages the relationship between students and courses, tracking progress (In Progress, Passed, Failed).
- **`grades`**: The core logic for marks entry, grade finalization, and GPA calculations.
- **`assign-course`**: Administrative tool for linking instructors to specific course offerings.

## Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e
```

## Deployment

The project includes configurations for multiple cloud providers:
- API for integration with frontend [Render](https://future-platform-i8rf.onrender.com)
- DB Host On Render