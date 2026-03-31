#!/bin/bash
# Script khởi tạo git repository với đầy đủ commit history và branches

echo "🔧 Khởi tạo Git repository..."
git init
git config user.email "student@example.com"
git config user.name "Sinh Vien"

# ── MAIN: initial commit ──────────────────────────────
git add README.md .gitignore
git commit -m "chore: initial project setup"

# ── BRANCH: feature/todo-api ─────────────────────────
git checkout -b feature/todo-api

git add backend/package.json
git commit -m "feat(backend): add package.json with express and mysql2 dependencies"

git add backend/server.js
git commit -m "feat(backend): implement REST API for todos (GET, POST, PUT, DELETE)"

git add backend/.env.example
git commit -m "chore(backend): add .env.example with required environment variables"

git add backend/Dockerfile
git commit -m "docker(backend): add Dockerfile for Node.js backend service"

# ── BRANCH: feature/frontend-ui ──────────────────────
git checkout main
git checkout -b feature/frontend-ui

git merge feature/todo-api --no-edit

git add frontend/index.html
git commit -m "feat(frontend): build todo app UI with dark theme"

git add frontend/nginx.conf
git commit -m "config(frontend): add nginx configuration for SPA routing"

git add frontend/Dockerfile
git commit -m "docker(frontend): add Dockerfile for nginx static frontend"

# ── BRANCH: feature/docker-setup ─────────────────────
git checkout main
git checkout -b feature/docker-setup

git merge feature/frontend-ui --no-edit

git add docker-compose.yml
git commit -m "docker: add docker-compose with backend, frontend, and mysql services"

# ── BRANCH: develop ───────────────────────────────────
git checkout main
git checkout -b develop

git merge feature/docker-setup --no-edit
git commit -m "chore(develop): merge all features into develop branch" --allow-empty

# ── MAIN: merge develop ───────────────────────────────
git checkout main
git merge develop --no-edit
git commit -m "release: v1.0.0 - todo app with docker support" --allow-empty

echo ""
echo "✅ Git repository đã được khởi tạo!"
echo ""
echo "📋 Branches:"
git branch
echo ""
echo "📝 Commit history:"
git log --oneline
echo ""
echo "👉 Tiếp theo:"
echo "   1. Thay thế placeholder thông tin SV trong backend/.env"
echo "   2. Tạo repo trên GitHub và push:"
echo "      git remote add origin https://github.com/USERNAME/REPO.git"
echo "      git push -u origin main"
echo "      git push origin develop feature/todo-api feature/frontend-ui feature/docker-setup"