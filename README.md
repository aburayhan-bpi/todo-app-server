# TODO Task Management Server

## Description
This is the backend server for the TODO Task Management application. It provides RESTful APIs to manage users and tasks, including user authentication, task creation, updates, retrieval, and deletion.

## Live Links
- **Backend API Base URL:** `https://todo-task-management-server-omega.vercel.app`
- **Live Link:** [Live Link](https://todo-task-management-53f91.web.app)

## Installation
Follow these steps to set up the project:

1. Clone the repository:
   ```bash
   git clone https://github.com/aburayhan-bpi/todo-app-server.git
   ```
2. Navigate to the project directory:
   ```bash
   cd todo-app-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   DB_USER=your_mongodb_user
   DB_PASS=your_mongodb_password
   PORT=5000
   ```
5. Start the server:
   ```bash
   npm start
   ```

## Dependencies
This project uses the following dependencies:
- **express** `^4.21.2` - Web framework for Node.js
- **cors** `^2.8.5` - Middleware for handling CORS
- **dotenv** `^16.4.7` - Loads environment variables from `.env`
- **mongodb** `^6.13.0` - MongoDB client for Node.js
- **morgan** `^1.10.0` - HTTP request logger middleware
- **moment** `^2.30.1` - Library for formatting and manipulating dates/time

## Technologies Used
- **Node.js** - Runtime environment
- **Express.js** - Backend framework
- **MongoDB** - NoSQL database
- **Morgan** - Logging requests
- **Moment.js** - Date & time handling
- **CORS** - Handling cross-origin requests

## API Endpoints
### Users
- `POST /users` - Save user data to the database

### Tasks
- `POST /tasks` - Save tasks to the database
- `GET /tasks` - Retrieve all tasks for a user
- `DELETE /tasks/:id` - Delete a specific task
- `PUT /tasks/:id` - Update task data



---
Contribution is available!