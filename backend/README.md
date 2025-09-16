# QUIZZ - Backend API

This is the backend server for the QUIZZ application, a platform for creating and taking quizzes. It provides the API for user authentication, quiz management, and results tracking.

## Features

- User authentication (login, registration)
- Role-based access control (Student, Teacher, Admin)
- Quiz creation and management
- Quiz taking and submission
- Result tracking and analytics

## Tech Stack

- Node.js
- Express.js
- MySQL
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository
2. Navigate to the backend directory
   ```bash
   cd backend
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Set up the environment variables by creating a `.env` file based on `.env.example`
5. Make sure your MySQL server is running and create a database named `quizz_db` (or as specified in your .env)
   ```sql
   CREATE DATABASE quizz_db;
   ```
6. Start the server
   ```bash
   npm start
   ```

The server will automatically create all the necessary tables on first run and a default admin user:
- Email: admin@quizz.com
- Password: admin123

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and receive JWT token
- `GET /api/auth/profile`: Get current user profile

### Quiz Management (Teacher)

- `GET /api/teacher/dashboard`: Teacher dashboard data
- `POST /api/teacher/quizzes`: Create a new quiz
- `PUT /api/teacher/quizzes/:id`: Update a quiz
- `DELETE /api/teacher/quizzes/:id`: Delete a quiz
- `GET /api/teacher/quizzes/:id/results`: Get results for a quiz

### Quiz Taking (Student)

- `GET /api/student/dashboard`: Student dashboard data
- `GET /api/student/results`: Get all quiz results
- `GET /api/student/results/:id`: Get detailed result for a quiz attempt
- `GET /api/student/leaderboard`: Get leaderboard data

### General Quiz Endpoints

- `GET /api/quizzes`: Get available quizzes
- `GET /api/quizzes/:id`: Get a specific quiz
- `POST /api/quizzes/:id/submit`: Submit a quiz attempt

### Admin Management

- `GET /api/admin/dashboard`: Admin dashboard data
- `GET /api/admin/users`: Get all users
- `POST /api/admin/users`: Create a new user
- `PUT /api/admin/users/:id`: Update a user
- `DELETE /api/admin/users/:id`: Delete a user

## License

[MIT](LICENSE)
