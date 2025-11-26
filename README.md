# Course Organizer

A modern, responsive web application to manage and organize university courses, lectures, assignments, and professors. Built with Node.js, Express, and MongoDB, featuring a complete UI overhaul using Bootstrap 5 and cloud-based file storage.

## 🚀 Features

-   **Modern UI/UX**: Fully responsive design using **Bootstrap 5** with a clean, professional aesthetic.
-   **User Authentication**: Secure registration and login system using Passport.js.
-   **Role-Based Access Control**:
    -   **Admin**: Full control to add/edit/delete courses, manage professors, and manage user roles.
    -   **User**: View enrolled courses, access lectures, and download assignments.
-   **Cloud Storage**: Integrated **Cloudinary** for secure and permanent storage of lecture PDFs and assignment files.
-   **Course Management**: Organize courses with details like credits, branch, and assigned professor.
-   **Professor Management**: Dedicated admin section to manage professor profiles.
-   **Mobile Friendly**: Fully responsive navbar and layout optimized for mobile devices.
-   **Secure Deployment**: Configured for production deployment on **Render** with MongoDB Atlas.

## 🛠️ Tech Stack

-   **Frontend**: EJS, Bootstrap 5, Bootstrap Icons
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose ODM)
-   **Storage**: Cloudinary (File Uploads)
-   **Authentication**: Passport.js (Local Strategy)
-   **Deployment**: Render (Web Service), MongoDB Atlas (Database)

## 📦 Installation

### Prerequisites

-   [Node.js](https://nodejs.org/) installed.
-   [MongoDB](https://www.mongodb.com/) installed (or use MongoDB Atlas).
-   [Cloudinary](https://cloudinary.com/) account (free tier).

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

    Create a `.env` file in the root directory (copy from `.env.example`):

    ```env
    SESSION_SECRET=your_secret_key
    MONGODB_URI=your_mongodb_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    NODE_ENV=development
    ```

4.  **Start the application:**

    ```bash
    npm start
    # OR for development
    npm run dev
    ```

5.  **Access the app:**

    Open your browser and go to `http://localhost:80`

## 🚀 Deployment

This project is configured for easy deployment on **Render**.

1.  Push your code to GitHub.
2.  Create a new Web Service on Render connected to your repo.
3.  Add the environment variables from your `.env` file to Render.
4.  Deploy!

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📂 Project Structure

-   `app.js`: Main entry point and configuration.
-   `models/`: Mongoose schemas (User, Course, Professor).
-   `routes/`: Express routes (Auth, Courses, Admin, Lectures).
-   `views/`: EJS templates for the frontend.
-   `config/`: Configuration files (Cloudinary).
-   `middleware/`: Auth and logging middleware.
-   `public/`: Static files (favicon, etc.).

## 📄 License

This project is licensed under the ISC License.