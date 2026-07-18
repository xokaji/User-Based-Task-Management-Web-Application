# Task Manager — MERN Stack

A full-stack task management app. Users register/login, then create, view, update,
delete, filter, search, sort and paginate their own tasks. Built with MongoDB,
Express, React (Vite), and Node.js.

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router DOM, Axios, Tailwind CSS, react-hot-toast
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Project Structure

```
mern-task-manager/
├── backend/
│   ├── config/db.js
│   ├── models/User.js, Task.js
│   ├── middleware/auth.js, errorHandler.js
│   ├── controllers/authController.js, taskController.js
│   ├── routes/authRoutes.js, taskRoutes.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── store/  (Redux Toolkit slices)
        ├── pages/  (Login, Register, Dashboard)
        └── components/ (Navbar, TaskForm, TaskList, TaskItem, ProtectedRoute)
```

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_manager   
JWT_SECRET=<generate a long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run:
```bash
npm run dev     # requires nodemon (npm install -g nodemon), or:
npm start
```
API runs at `http://localhost:5000`. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend runs elsewhere:
```
VITE_API_URL=http://localhost:5000/api
```

Run:
```bash
npm run dev
```
App runs at `http://localhost:5173`.

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get logged-in user (protected) |

### Tasks (all protected — JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get tasks (supports `status`, `search`, `sortBy`, `order`, `page`, `limit` query params) |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get single task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/status | Update task status only |

## Features Implemented

- ✅ Register, login, logout, JWT auth, protected routes
- ✅ Password hashing (bcrypt), token stored in localStorage
- ✅ Users can only access their own tasks (enforced server-side via `user` field on every query)
- ✅ Full task CRUD + status toggle
- ✅ Filter by All / Pending / Completed
- ✅ Bonus: search (MongoDB text index), sort (by date/priority), pagination, toast notifications, loading states


