# 🎓 Alumni Platform

A full-stack web application that connects alumni and students — enabling mentorship, job opportunities, and community networking.

---

## 📖 About the Project

The **Alumni Platform** is designed to bridge the gap between current students and alumni. It provides a space for alumni to give back by offering mentorship, posting job opportunities, and staying connected with their college community.

---

## ✨ Features

- 🔐 **Authentication** — Register & Login with JWT-based auth
- 🧑‍💼 **User Profiles** — Alumni and student profile management
- 🤝 **Mentorship** — Students can request mentorship from alumni
- 💼 **Job Board** — Alumni can post job & internship opportunities
- 📁 **Directory** — Browse and search alumni/student profiles
- 💬 **Messages** — Direct messaging between users
- 🛠️ **Admin Panel** — Manage users and platform content

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI Framework |
| React Router | Client-side routing |
| Axios | API calls |
| CSS | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| JWT | Authentication |
| bcrypt | Password hashing |

---

## 📁 Project Structure

```
alumni-platform/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       ├── context/
│       │   └── AuthContext.js
│       ├── lib/
│       ├── pages/
│       │   ├── AdminPanel.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Directory.jsx
│       │   ├── Jobs.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Mentorship.jsx
│       │   ├── Messages.jsx
│       │   ├── Profile.jsx
│       │   └── Register.jsx
│       ├── App.js
│       └── index.css
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v16 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/saranya261/alumni-platform.git
cd alumni-platform
```

**2. Setup Backend**
```bash
cd backend
npm install
npm start
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm start
```

**4. Open in browser**
```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```


## 📄 License

This project was built as part of an academic full-stack development course.

---
