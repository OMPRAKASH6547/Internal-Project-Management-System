# Internal Project Management System (IPMS)

Production-ready full-stack project management app built with Next.js App Router where frontend and backend live in one codebase.

## Architecture
- **Frontend**: Next.js pages/components (`app`, `components`) + Zustand (`store`)
- **Backend**: Next.js Route Handlers (`app/api`)
- **Database**: MongoDB with Mongoose models (`models`)
- **Realtime**: Socket.IO via custom Node server (`server.js`) with project rooms
- **Pub/Sub**: Redis adapter for horizontal scale (optional but supported)
- **Auth**: JWT in HTTP-only cookies + middleware route protection

Detailed planning docs:
- `docs/FRD.md`
- `docs/SYSTEM_DESIGN.md`

## Why Next.js Fullstack
- Single repository for UI + APIs speeds up development and maintenance.
- Shared utilities/validation between client and server reduce duplication.
- App Router + middleware provides built-in routing and protection patterns.
- Easier deployment for internal teams preferring one service boundary.

## Trade-offs vs Express
- **Pros**: faster integrated delivery, shared code, convention-based routing.
- **Cons**: less backend-only flexibility, stronger framework coupling, websocket-heavy apps may later split realtime into separate service.

## Project Structure
```text
app/
  api/
    auth/
      login/route.js
      register/route.js
      logout/route.js
      me/route.js
    projects/
      route.js
      [projectId]/route.js
    tasks/
      route.js
      [taskId]/route.js
  (auth)/login/page.js
  dashboard/page.js

lib/
  db.js
  auth.js
  socket.js
  socket-client.js
  redis.js
  api-client.js
  api-response.js
  validators.js
  project-access.js

models/
  User.js
  Project.js
  Task.js

components/
store/
proxy.js
server.js
```

## API Routes List
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

## Socket Events
- Client -> Server:
  - `project:join` `{ projectId }`
  - `project:leave` `{ projectId }`
- Server -> Clients in project room:
  - `task:create` (new task payload)
  - `task:update` (updated task payload)

## Setup
1. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill values:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `REDIS_URL` (optional preferred for multi-instance)
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000`

## Build and Run (Production)
```bash
npm run build
npm run start
```

## Nginx Reverse Proxy (Example)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL (Let's Encrypt)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## One API Route Explained Line-by-Line
Example: `POST /api/tasks` in `app/api/tasks/route.js`
1. `requireAuth(request)` validates JWT and extracts user identity.
2. `taskCreateSchema.parse(...)` validates body with Zod.
3. `connectDB()` ensures singleton MongoDB connection.
4. `assertProjectAccess(projectId, userId)` prevents unauthorized writes.
5. `Task.create(...)` persists task document.
6. `emitProjectEvent(projectId, "task:create", payload)` broadcasts realtime update.
7. Returns `201` with normalized task response.

## One Socket Event Lifecycle
Lifecycle for `task:update`:
1. User drags task in Kanban UI.
2. Client calls `PATCH /api/tasks/:taskId` with new status.
3. API validates auth + access, updates MongoDB.
4. API emits `task:update` to room `project:{projectId}`.
5. All connected clients in that project receive event.
6. Zustand `upsertTask()` updates local board state instantly.

## Notes
- Route-level validation uses Zod.
- API responses use centralized helpers.
- Proxy middleware protects dashboard and non-auth API routes.
- Socket and API layers are abstracted for clean code and maintainability.
