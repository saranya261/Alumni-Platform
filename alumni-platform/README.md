# College Alumni Networking Platform

A full-stack MERN app with JWT auth, mentorship requests, job board, and real-time messaging.

---

## Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

Install MongoDB: https://www.mongodb.com/docs/manual/installation/

---

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
npm start
```
Runs on http://localhost:5000
Auto-seeds 6 demo users + 3 job postings on first run.

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

---

## Demo Logins

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@alumni.edu       | admin123   |
| Student | student1@alumni.edu    | student123 |
| Student | student2@alumni.edu    | student123 |
| Alumni  | alumni1@alumni.edu     | alumni123  |
| Alumni  | alumni2@alumni.edu     | alumni123  |
| Alumni  | alumni3@alumni.edu     | alumni123  |

---

## File Structure

```
alumni-platform/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── seed.js
│   ├── models/
│   │   ├── User.js
│   │   ├── MentorshipRequest.js
│   │   ├── Opportunity.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── mentorshipRoutes.js
│   │   ├── opportunityRoutes.js
│   │   └── messageRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── mentorshipController.js
│   │   ├── opportunityController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── tokens.js
│   └── ws/
│       └── manager.js
│
└── frontend/
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── lib/
        │   └── api.js
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Directory.jsx
            ├── Profile.jsx
            ├── Mentorship.jsx
            ├── Jobs.jsx
            └── Messages.jsx
```

---

## Features
- JWT auth with httpOnly cookies + bcrypt password hashing
- Role-based access: Student / Alumni / Admin
- Alumni directory with search & filters
- Mentorship request lifecycle (send → accept/reject)
- Job/opportunity board (alumni can post, all can view)
- Real-time messaging via WebSocket
