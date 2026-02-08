# Job Application Assistant Platform

A job application assistance platform designed to help users **create professional profiles, manage resumes, get matched with relevant jobs, and streamline the job application process**.

This project is being built with scalability and real-world workflows in mind, progressing from a strong frontend foundation to full backend automation.

---

## Key Features

### User Authentication & Authorization
- Secure **Sign Up / Login** flow  
- Auth-ready architecture for **JWT-based authentication**  
- Protected user-specific data and flows  

---

###  Profile Creation & Management
- **Multi-step profile builder**
- Collects:
  - Personal details  
  - Account information  
  - Skills  
  - Work experience  
- Global state management using **Context API + useReducer**

---

### Resume Management
- Resume upload support (backend-ready)
- Structured to integrate parsing and storage in future phases

---

### Job Matching (Planned)
- Match users to jobs based on:
  - Skills
  - Experience
  - Profile data
- Designed for API-based job sourcing

---

### Automated Application Assistance (Planned)
- Prepare applications automatically using user profile data
- Future support for:
  - Auto-fill applications
  - Application tracking
  - Submission assistance

---

### Notifications (Planned)
- Email notifications for:
  - Job matches
  - Application status updates
- Designed for **Nodemailer integration**

---

## Tech Stack

### Frontend
- **React**
- **Vite**
- **Context API**
- **useReducer**
- **CSS Modules**
- Production-ready component architecture

### Backend (In Progress)
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT Authentication**

### Tooling & Utilities
- Axios  
- Nodemailer  
- Git & GitHub  

---

##  Project Structure

```bash
job-application-assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── steps/
│   │   │   └── layout/
│   │   ├── context/
│   │   ├── reducer/
│   │   ├── styles/
│   │   └── App.jsx
│   │
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
│   │
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
