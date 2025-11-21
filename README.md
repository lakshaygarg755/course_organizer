# Course Organizer

A web-based application to manage and organize university courses, lectures, assignments, and professors. This project allows administrators to manage course content and users to view enrolled courses and materials.

## Features

- **User Authentication**: Secure registration and login system using Passport.js.
- **Role-Based Access Control**:
  - **Admin**: Can add, edit, and delete courses, and manage professors.
  - **User**: Can view available courses, lectures, and assignments.
- **Course Management**: Organize courses with details like credits, branch, and assigned professor.
- **Content Delivery**: Upload and manage links to lectures and assignments (PDFs).
- **Professor Management**: Database of professors linked to courses.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose for ODM)
- **Templating**: EJS (Embedded JavaScript templates)
- **Authentication**: Passport.js (Local Strategy), bcrypt for password hashing
- **Session Management**: express-session, connect-mongo

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) installed and running locally.

### Steps

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:lakshaygarg755/course_organizer.git
    cd course_organizer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root directory and add the following:

    ```env
    SESSION_SECRET=your_secret_key
    ```

4.  **Start the application:**

    ```bash
    npm start
    # OR for development with nodemon
    npm run dev
    ```
    *(Note: You may need to install nodemon globally or use `npx nodemon app.js` if not in package.json scripts, though it is listed as a dependency).*

5.  **Access the app:**

    Open your browser and go to `http://localhost:80`

## Usage

1.  **Register**: Create a new account.
2.  **Login**: Log in with your credentials.
3.  **Dashboard**:
    - **Admins** will see options to add/edit courses.
    - **Users** will see the list of courses they can access.

## Project Structure

-   `app.js`: Main entry point of the application.
-   `models/`: Mongoose schemas for User, Course, and Professor.
-   `routes/`: Express routes for different functionalities (Auth, Courses, Admin, etc.).
-   `views/`: EJS templates for the frontend.
-   `middleware/`: Custom middleware (e.g., authentication checks).
-   `public/` or `uploads/`: Static files and uploads.

## License

This project is licensed under the ISC License.