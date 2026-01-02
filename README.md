# 🚀 Scalable Task Management API with Role-Based Access

A production-ready full-stack application built as part of the **Backend Developer Intern Assignment**.  
The project demonstrates secure authentication, role-based authorization, Redis caching, scalable REST API design, and a functional frontend UI.

---

## 🔗 Live URLs

- **Backend API:** https://<your-backend>.onrender.com
- **Frontend App:** https://<your-frontend>.vercel.app

---

## 📌 Features

### 🔐 Authentication & Authorization
- User registration and login
- Password hashing using **bcrypt**
- JWT-based authentication
- Role-based access control (**User / Admin**)

### 🗂 Task Management (CRUD)
- Create, read, update tasks
- Tasks are user-specific
- Admin can view and delete **all tasks**

### ⚡ Redis Caching
- Redis used to cache frequently accessed task data
- Automatic cache invalidation on create/update/delete
- Improves response time and scalability

### 📦 API Design
- RESTful API structure
- API versioning (`/api/v1`)
- Centralized error handling
- Proper HTTP status codes

### 🎨 Frontend UI
- Built using **React + Tailwind CSS**
- Authentication flows (register/login)
- Protected dashboard
- Admin panel for task management
- Integrated API error feedback

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Redis (Upstash)
- JWT Authentication
- Mongoose ODM

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Deployment
- Backend: **Render**
- Frontend: **Vercel**
- Database: **MongoDB Atlas**
- Cache: **Upstash Redis**

---

## 📂 Project Structure (Backend)
```
backend/
├── src/
│ ├── config/ # DB & Redis configuration
│ ├── controllers/ # Business logic
│ ├── middleware/ # Auth & role checks
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ └── server.js # App entry point
├── .env
├── package.json
└── README.md
Frontend/
```

---

## 🔑 Environment Variables

```env
PORT=<Port Number>
MONGO_URI=<MongoDB Atlas URI>
JWT_SECRET=<JWT Secret>
REDIS_URL=<Upstash Redis URL>
```
## 📡 API Endpoints

## Auth
| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/register` | Register new user |
| POST   | `/api/v1/auth/login`    | Login user        |

## Task
| Method | Endpoint            | Access |
| ------ | ------------------- | ------ |
| POST   | `/api/v1/tasks`     | User   |
| GET    | `/api/v1/tasks`     | User   |
| PUT    | `/api/v1/tasks/:id` | User   |
| DELETE | `/api/v1/tasks/:id` | Admin  |
| GET    | `/api/v1/tasks/all` | Admin  |

## 📬 API Documentation
```
Postman Collection:
📁 Included in repository (postman_collection.json)
```

## 📈 Scalability & Architecture Notes
```
Stateless JWT authentication enables horizontal scaling
Redis caching reduces database load and improves response time
Clean modular structure supports easy microservice separation
Can be extended with:
Load balancers (NGINX)
Rate limiting
Background jobs (queues)
Docker + Kubernetes for orchestration
```
