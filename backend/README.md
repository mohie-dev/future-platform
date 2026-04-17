# Future Platform - Backend

This is the backend service for the **Student Information System (SIS)** built with [NestJS](https://nestjs.com/).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- PostgreSQL

## Installation

```bash
$ npm install
```

## Configuration

Ensure you have a `.env` file in the root of the `backend` directory. Sample `.env` configuration:

```env
# DB
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_NAME=future-platform-db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## Running the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Modules Overview

The backend is organized systematically into the following main modules:
- **`users`**: Authentication, authorization, and base user entity management (includes password setup flows).
- **`students`**: Student profiles, academic data handling.
- **`instructors`**: Instructor details and management.
- **`courses`**: Course catalog, creation, and details.
- **`assign-course`**: Functionality for assigning courses to instructors.
- **`enrollments`**: Student course registration, progress tracking, and grading.

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
