# Todo App — DevOps Mini Project

Ứng dụng quản lý công việc (Todo) được xây dựng với Node.js, Express, MySQL và Docker.

## 🚀 Chạy nhanh với Docker Compose

```bash
docker-compose up --build -d
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health
- About: http://localhost:3000/about

## 📁 Cấu trúc

```
devops-project/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint     | Mô tả            |
|--------|-------------|------------------|
| GET    | /health     | Health check     |
| GET    | /about      | Thông tin SV     |
| GET    | /todos      | Lấy danh sách    |
| GET    | /todos/:id  | Lấy 1 todo       |
| POST   | /todos      | Tạo todo mới     |
| PUT    | /todos/:id  | Cập nhật todo    |
| DELETE | /todos/:id  | Xóa todo         |

## 🌿 Git Branches

- `main` — production
- `develop` — development  
- `feature/todo-api` — feature branch
- `feature/frontend-ui` — feature branch
- `feature/docker-setup` — feature branch

## 🐳 Docker Hub

```bash
# Build và push
docker build -t <dockerhub-username>/todo-backend ./backend
docker build -t <dockerhub-username>/todo-frontend ./frontend
docker push <dockerhub-username>/todo-backend
docker push <dockerhub-username>/todo-frontend
```