# Job Application Assistant Platform

A **full-stack job automation platform** designed to help users **create profiles, upload resumes, get matched with suitable jobs, and automate applications**.  

---

##  Features

- **User Authentication & Authorization**  
  Sign up, log in, and secure access to user-specific data using **JWT**.

- **Profile Creation & Management**  
  Multi-step forms to capture personal details, skills, and experience.

- **Resume Upload**  
  Users can upload resumes to support automated job applications.

- **Job Matching & Recommendations**  
  Automatically suggest jobs based on user profile and skills.

- **Automated Application Assistance**  
  Platform prepares or applies for jobs on behalf of the user (backend integration).

- **Notifications**  
  Email notifications for matched jobs or application updates.

---

## Tech Stack

- **Frontend:** React, Context API, useReducer, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  
- **Other Tools:** Axios, Nodemailer, Vite, Git/GitHub  

---

## Project Structure

job-application-assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
