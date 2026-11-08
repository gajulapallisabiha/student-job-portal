\# Student Job \& Internship Portal – Project Architecture



\## 1. Introduction



The Student Job \& Internship Portal is a full-stack web application developed using the MERN stack. It connects students with companies and provides a platform to manage job opportunities and applications.



\## 2. Technologies Used



\- Frontend: React.js, JavaScript, HTML and CSS

\- Backend: Node.js and Express.js

\- Database: MongoDB Atlas

\- Authentication: JSON Web Token (JWT)

\- Version Control: Git and GitHub



\## 3. System Architecture



The application follows a three-layer architecture:



1\. Presentation Layer – React frontend provides the user interface.

2\. Application Layer – Node.js and Express.js handle API requests and business logic.

3\. Database Layer – MongoDB stores users, jobs, applications and profile information.



\## 4. Frontend Architecture



The frontend is developed using React.js.



Main responsibilities:

\- Display registration and login pages.

\- Show available jobs and internships.

\- Provide student profile and resume management.

\- Allow students to apply for jobs.

\- Provide company dashboards for managing jobs and applicants.

\- Display application status and notifications.



\## 5. Backend Architecture



The backend is developed using Node.js and Express.js.



\### Backend Folder Structure



| Folder | Responsibility |

|---|---|

| config | Application configuration |

| controllers | Business logic and request handling |

| middleware | Authentication, authorization and file uploads |

| models | MongoDB data models |

| routes | REST API endpoint definitions |

| uploads | Stores uploaded files |



\### Main Backend Modules



\- Authentication module

\- Job management module

\- Application management module

\- Student profile module

\- Resume management module



\## 6. Database Architecture



MongoDB Atlas is used as the database.



The database stores information related to:

\- Student and company accounts

\- Job postings

\- Job applications

\- Student profiles

\- Resume information



Mongoose is used to interact with MongoDB through models.



\## 7. Authentication and Authorization



The application uses JWT-based authentication.



\- Users register and log in.

\- The backend authenticates users.

\- Protected routes require a valid token.

\- Role-based authorization separates STUDENT and COMPANY access.

\- Students can apply for jobs and manage profiles.

\- Companies can post jobs and manage applications.



\## 8. Application Workflow



\### Student Workflow



1\. Register or log in.

2\. Browse available jobs.

3\. View job details.

4\. Apply with a cover letter and resume.

5\. Track application status.

6\. Manage profile and resume.



\### Company Workflow



1\. Register or log in.

2\. Post job opportunities.

3\. Manage posted jobs.

4\. View student applications.

5\. Accept or reject applications.

6\. Update application status.



\## 9. Communication Flow



1\. The user interacts with the React frontend.

2\. The frontend sends HTTP requests to the Express backend.

3\. Express routes direct requests to the appropriate controllers.

4\. Middleware checks authentication, authorization and uploaded files when required.

5\. Controllers interact with MongoDB through Mongoose models.

6\. The backend returns a response to the frontend.

7\. React updates the user interface.



\## 10. Conclusion



The project uses a modular architecture that separates the frontend, backend, database and authentication responsibilities. This structure makes the application easier to maintain, understand and extend.

