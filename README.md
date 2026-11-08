# Student Job & Internship Portal

A full-stack MERN application that connects students with companies and helps them find and apply for job and internship opportunities.

## Features

### Student
- Register and log in securely.
- Browse available jobs and internships.
- Search and view job details.
- Apply for jobs with a cover letter.
- Upload and manage resumes.
- View submitted applications and application statuses.
- Manage student profile.

### Company
- Register and log in as a company.
- Post new job opportunities.
- View and manage posted jobs.
- View applicants and their details.
- Accept or reject applications.
- Update application statuses.

## Technologies Used

- **Frontend:** React.js, JavaScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT
- **Tools:** VS Code, Git, GitHub, Postman

## Project Structure

```text
student-job-portal/
├── client/       # React frontend
└── server/       # Node.js and Express backend
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/gajulapallisabiha/student-job-portal.git
cd student-job-portal
```

### 2. Start the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm start
```

### 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Application Purpose

The Student Job & Internship Portal simplifies the recruitment process by providing a common platform for students and companies. Students can discover opportunities and track applications, while companies can post jobs and manage applicants.

## Author

Developed as a B.Sc. Computer Science academic project.
