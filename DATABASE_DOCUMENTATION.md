\# Student Job \& Internship Portal – Database Documentation



\## 1. Introduction



The Student Job \& Internship Portal uses MongoDB Atlas as its database and Mongoose as the Object Data Modeling (ODM) library.



The application contains three main collections:



1\. User

2\. Job

3\. Application



\## 2. User Collection



\*\*Model:\*\* `User.js`



\*\*Purpose:\*\* Stores student, company and administrator account information.



| Field | Data Type | Description |

|---|---|---|

| name | String | User's name |

| email | String | Unique email address |

| password | String | User's password |

| role | String | STUDENT, COMPANY or ADMIN |

| phone | String | Contact number |

| location | String | User's location |

| education | String | Educational details |

| bio | String | User biography |

| skills | Array of Strings | User's skills |

| resumeUrl | String | Resume file location |

| timestamps | Date | Created and updated dates |



\*\*Important validations:\*\*

\- Name, email and password are required.

\- Email must be unique and is stored in lowercase.

\- Password must contain at least 6 characters.

\- Default role is STUDENT.



\## 3. Job Collection



\*\*Model:\*\* `Job.js`



\*\*Purpose:\*\* Stores job and internship opportunities posted by companies.



| Field | Data Type | Description |

|---|---|---|

| title | String | Job title |

| company | String | Company name |

| companyId | ObjectId | Reference to User |

| description | String | Job description |

| location | String | Job location |

| type | String | Internship, Full-time or Part-time |

| salary | String | Salary information |

| skills | Array of Strings | Required skills |

| eligibility | String | Eligibility requirements |

| deadline | Date | Application deadline |

| postedDate | Date | Date the job was posted |

| timestamps | Date | Created and updated dates |



\*\*Important validations:\*\*

\- Title, company, description and location are required.

\- Job type must be Internship, Full-time or Part-time.

\- Default salary is "Not specified".

\- Each job can reference the company account that posted it.



\## 4. Application Collection



\*\*Model:\*\* `Application.js`



\*\*Purpose:\*\* Stores student applications submitted for available jobs.



| Field | Data Type | Description |

|---|---|---|

| student | ObjectId | Reference to User |

| job | ObjectId | Reference to Job |

| coverLetter | String | Student's application letter |

| resumeUrl | String | Uploaded resume location |

| status | String | Current application status |

| appliedDate | Date | Application submission date |

| statusHistory | Array | History of status changes |

| timestamps | Date | Created and updated dates |



\*\*Application statuses:\*\*

\- Applied

\- Under Review

\- Shortlisted

\- Selected

\- Rejected



Each status history entry stores:

\- status – The updated application status.

\- changedAt – Date and time of the change.

\- changedBy – User who changed the status.



\*\*Important validations:\*\*

\- Student, job and cover letter are required.

\- Default status is Applied.

\- Duplicate applications for the same student and job are prevented using a unique compound index.



\## 5. Database Relationships



The application uses MongoDB ObjectId references to connect its collections.



\### User and Job



\- One company user can post multiple jobs.

\- The `companyId` field in Job references the User collection.



\### User and Application



\- One student can submit multiple applications.

\- The `student` field in Application references the User collection.



\### Job and Application



\- One job can receive multiple applications.

\- The `job` field in Application references the Job collection.



\## 6. Relationship Summary



| Relationship | Description |

|---|---|

| User → Job | A company posts multiple jobs |

| User → Application | A student submits multiple applications |

| Job → Application | A job receives multiple applications |



\## 7. Data Integrity



The database uses:

\- Required field validation.

\- Unique email validation.

\- Enumerated values for roles, job types and application statuses.

\- ObjectId references between collections.

\- A unique compound index on student and job to prevent duplicate applications.

\- Automatic timestamps for tracking record creation and updates.



\## 8. Conclusion



The database design separates user accounts, job postings and job applications into three collections. ObjectId references establish relationships between these collections, while Mongoose schemas provide validation and data consistency.

