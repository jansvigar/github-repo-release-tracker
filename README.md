# GitHub Release Tracker

---

## Prerequisites

- **Docker** (Engine & CLI) & **Docker Compose**
- **Node.js** v22+
- **pnpm** (via Corepack)
- **Git**

---

## 1. Clone the Repository

```bash
git clone git@github.com:jansvigar/github-repo-release-tracker.git
cd github-repo-release-tracker
```

---

## 2. Quick Start

Follow these steps from the project root:

1. **Enable pnpm via Corepack**

   ```bash
   corepack enable
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Variables**

   Copy and configure `.env` files in the apps/api directory:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   - **GITHUB_PAT**: GitHub personal access token
   - **DATABASE_URL**: `postgres://postgres:postgres@localhost:5432/github_tracker`

4. **Start the database**

   ```bash
   docker-compose up -d db
   ```

5. **Generate and run database migrations**

   ```bash
   # In the API package, generate a new migration
   pnpm --filter="@ghtracker/api" db:generate-migrations
   # Apply all pending migrations
   pnpm --filter="@ghtracker/api" db:run-migrations
   ```

6. **Run in development mode**

   ```bash
   pnpm dev
   ```

---

## 3. Access the Apps

- **Frontend (Web)**: [http://localhost:5173](http://localhost:5173)
- **GraphQL Playground**: [http://localhost:3001/api/graphiql](http://localhost:3001/api/graphiql)

---

## Features & Areas for Improvement

### Implemented Features

- **Track Repositories**: Add GitHub repository URLs to track updates, persisted in PostgreSQL.
- **Latest Release Details**: Displays repo name, latest tag, publish date, and full release notes. New releases since last "seen" are visually marked.
- **Mark as Seen**: Clicking a repo card marks its latest release as seen.
- **Manual Refresh**: "Refresh All" button fetches the latest release data for all tracked repositories.
- **Mobile Responsiveness**: Optimize layout for small screens.

### Areas for Improvement

- **Release Detail View**: Expand to include commit history and rich formatting of notes.
- **Filters & Sorting**: Add UI controls to filter/sort by status, date, or name.
- **Notifications**: Implement desktop or in-app notifications for new releases.
- **Authentication**: Add GitHub OAuth so users can track repos under their accounts.
- **Real-time Sync**: Leverage GitHub webhooks or background jobs for automated updates.
- **Pagination & Virtualization**: Implement paging or virtual scrolling to handle large lists efficiently.
- **Error Handling & Monitoring**: Add detailed error handling, logging, and monitoring (e.g., Sentry) for better observability.
- **Slow Network Handling**: Provide UX feedback (e.g., skeletons, toasts) and retry logic for unreliable connections.

---

## 4. Docker Installation (Optional)

If Docker is not installed, follow these steps for your platform:

- macOS / Windows: Install Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

Verify installation:

```bash
docker --version
docker-compose --version
```

---

## 5. Running Tests

```bash
pnpm test
```

Tests are configured with Vitest and React Testing Library.

---

## 6. Stopping the database service

To stop the db service:

```bash
docker-compose down
```

---
