# System Design

## 1. Architecture Diagram (Next.js Fullstack)
```text
Browser (React UI + Zustand + Socket client)
    |
    | HTTPS
    v
Nginx Reverse Proxy (TLS termination)
    |
    v
Node Custom Server (server.js)
    |-- Next.js App Router pages (frontend SSR/CSR)
    |-- Next.js Route Handlers (/app/api/*) (backend APIs)
    |-- Socket.IO Server (/socket.io)
             |-- emits to project rooms
             |-- optional Redis adapter for multi-instance pub/sub
    |
    +--> MongoDB (Users, Projects, Tasks)
    +--> Redis (optional preferred: Socket.IO pub/sub adapter)
```

## 2. API Routes Structure
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId`
- `DELETE /api/projects/:projectId`
- `GET /api/tasks?projectId=...`
- `POST /api/tasks`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

## 3. MongoDB Schemas
### User
- `_id`
- `name`
- `email` (unique)
- `password` (hashed with bcrypt)
- `role` (`admin|manager|member`)
- `createdAt`, `updatedAt`

### Project
- `_id`
- `name`
- `description`
- `ownerId` (ref User)
- `memberIds[]` (ref User)
- `status` (`active|archived`)
- `createdAt`, `updatedAt`

### Task
- `_id`
- `projectId` (ref Project)
- `title`
- `description`
- `status` (`todo|in_progress|done`)
- `priority` (`low|medium|high`)
- `assigneeId` (ref User, nullable)
- `createdBy` (ref User)
- `dueDate` (nullable)
- `createdAt`, `updatedAt`

## 4. Real-Time Strategy
- Socket connection established by client through `lib/socket-client.js`.
- Client emits `project:join` with active project ID.
- Server maps each project to room key `project:{projectId}`.
- Task APIs trigger room broadcasts:
  - `task:create` after successful creation
  - `task:update` after successful update
- Dashboard store handles these events and upserts local state.
- Redis adapter optionally synchronizes room events between server instances.

## 5. Trade-offs: Next.js Fullstack vs Express
### Pros
- Single repository and runtime for UI + API.
- Shared validation/utilities between frontend/backend.
- Built-in routing conventions and middleware.
- Easier deployment for teams preferring one stack.

### Cons
- Less backend-only flexibility than dedicated Express architecture.
- Custom Socket.IO server bypasses some serverless deployment patterns.
- Vendor/framework coupling is stronger.
- Long-running websocket-heavy workloads may need separate service at scale.
