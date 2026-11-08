\# Student Job \& Internship Portal – API Documentation



\## 1. Introduction



This document describes the REST API endpoints used in the Student Job \& Internship Portal. The backend is developed using Node.js and Express.js, with MongoDB as the database.



\*\*Base URL:\*\* `http://localhost:5000/api`



\## 2. Authentication APIs



Base path: `/api/auth`



| Method | Endpoint | Description | Access |

|---|---|---|---|

| POST | `/auth/register` | Register a new user | Public |

| POST | `/auth/login` | Log in an existing user | Public |



\## 3. Job APIs



Base path: `/api/jobs`



| Method | Endpoint | Description | Access |

|---|---|---|---|

| GET | `/jobs` | Retrieve all available jobs | Public |

| GET | `/jobs/:id` | Retrieve a job by ID | Public |

| GET | `/jobs/my-jobs` | Retrieve jobs posted by the logged-in company | Company |

| POST | `/jobs` | Create a new job | Company |

| PUT | `/jobs/:id` | Update a job | Company |

| DELETE | `/jobs/:id` | Delete a job | Company |



\## 4. Application APIs



Base path: `/api/applications`



| Method | Endpoint | Description | Access |

|---|---|---|---|

| POST | `/applications` | Apply for a job with resume upload | Student |

| GET | `/applications/my-applications` | View the logged-in student's applications | Student |

| GET | `/applications/job/:jobId` | View applications for a particular job | Company |

| PUT | `/applications/:id/status` | Update an application status | Company |



\## 5. Student Profile APIs



Base path: `/api/profile`



| Method | Endpoint | Description | Access |

|---|---|---|---|

| GET | `/profile` | Retrieve the logged-in student's profile | Student |

| PUT | `/profile` | Update the student's profile | Student |



\## 6. Resume APIs



Base path: `/api/resume`



| Method | Endpoint | Description | Access |

|---|---|---|---|

| POST | `/resume/upload` | Upload or update a student's resume | Student |



\## 7. Authentication and Authorization



The application uses JSON Web Tokens (JWT) for authentication.



\- Public APIs can be accessed without logging in.

\- Protected APIs require a valid authentication token.

\- Student-only APIs are accessible to users with the STUDENT role.

\- Company-only APIs are accessible to users with the COMPANY role.

\- Role-based middleware prevents unauthorized access.



\## 8. File Upload



The application supports resume uploads through multipart form data.



\- Application resume field: `resume`

\- Resume management field: `resume`

\- Upload endpoints require student authentication.



\## 9. HTTP Methods



\- \*\*GET:\*\* Retrieve information.

\- \*\*POST:\*\* Create resources or submit information.

\- \*\*PUT:\*\* Update existing resources.

\- \*\*DELETE:\*\* Remove resources.



\## 10. Conclusion



The REST API provides separate functionalities for authentication, job management, applications, student profiles, and resume uploads. Authentication and role-based authorization help protect the application's resources.

