# Functional Requirement Document (FRD)

## 1. Product Overview
Internal Project Management System (IPMS) is a full-stack web application for internal teams to plan projects, manage tasks on a Kanban board, and collaborate with real-time updates.

## 2. Goals
- Centralize project and task workflows in one secure app.
- Provide real-time task updates across project members.
- Keep architecture simple by using one Next.js codebase for frontend and backend.

## 3. User Roles
- `admin`: Full access across projects (future extension).
- `manager`: Creates and manages projects/tasks.
- `member`: Works on assigned projects and tasks.

## 4. Functional Requirements
### 4.1 Authentication
- User can register with name, email, and password.
- User can login/logout.
- App stores JWT in HTTP-only cookie.
- Protected pages and protected API routes reject unauthenticated access.

### 4.2 Project Management
- User can create a project.
- User can view projects where user is owner/member.
- User can update basic project details.
- User can archive/delete project.

### 4.3 Task Management
- User can create tasks under a project.
- User can fetch tasks by project.
- User can update task status, description, priority, assignee, and due date.
- User can delete tasks.

### 4.4 Kanban Board
- Tasks are grouped in columns: `todo`, `in_progress`, `done`.
- User can move tasks between columns.
- Board updates immediately when task changes are received in real time.

### 4.5 Real-Time Collaboration
- Client joins project room via Socket.IO.
- Server emits `task:create` and `task:update`.
- All connected users in the same room receive updates.

### 4.6 Error and Loading UX
- API returns consistent JSON error shape.
- UI shows loading and error states for all key actions.

## 5. Non-Functional Requirements
- **Performance**: API p95 < 500ms for standard CRUD operations.
- **Security**: Password hashing, JWT auth, HTTP-only cookie, middleware protection.
- **Scalability**: Redis adapter for Socket.IO horizontal scale.
- **Maintainability**: Clear module boundaries (`lib`, `models`, `components`, `store`).
- **Availability**: Nginx reverse proxy + TLS termination.

## 6. Acceptance Criteria
- User can authenticate and access dashboard.
- User can create projects and tasks.
- Task create/update reflects across two browser sessions in near real time.
- Unauthorized API call returns `401`.
- Deployment steps allow running behind Nginx with SSL.
