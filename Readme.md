# VisualizeX

VisualizeX is a production-hardened, full-stack algorithm visualization and cloud code execution platform. It features an interactive sorting visualizer with real-time controls, an in-browser multi-language Online IDE, isolated Docker execution sandboxes, server-to-server authenticated APIs, and persistent database storage.

---

## Architecture Overview

```
Browser Client (Online IDE & Visualizer)
       │
       │  HTTPS (Let's Encrypt TLS)
       ▼
 ┌──────────────┐
 │ Caddy Proxy  │ (Ports 80 & 443)
 └──────┬───────┘
        │ (Internal Docker Bridge)
        ▼
 ┌──────────────┐       ┌───────────────┐
 │ Next.js App  ├──────►│  PostgreSQL   │ (NextAuth User Accounts)
 └──────┬───────┘       └───────────────┘
        │ (Signed HMAC-SHA256 Assertion)
        ▼
 ┌──────────────┐       ┌───────────────┐
 │ Elysia Worker├──────►│    MongoDB    │ (Saved User Code)
 └──────┬───────┘       └───────────────┘
        │ (Rootless Docker Socket)
        ▼
 ┌──────────────────────────────────────────────┐
 │ Disposable Runner Containers                 │
 │ (--network none, --read-only, UID 1001)      │
 └──────────────────────────────────────────────┘
```

---

## Key Features

1. **Interactive Sorting Algorithm Visualizer**:
   - 18 sorting algorithms: Bubble, Bucket, Comb, Cycle, Gnome, Heap, Insertion, Introsort, Bottom-Up Merge, Top-Down Merge, Odd-Even, Pancake, Quicksort, Radix, Selection, Shell, Timsort, and Bogosort.
   - Robust step-indexed playback controls: **Start**, **Pause**, **Resume**, **Reset**, and **Speed Adjustment** without page reloads.
   - Hardened edge-case handling for empty arrays, single elements, negative numbers, duplicates, and equal-element arrays.

2. **Multi-Language Online IDE**:
   - Monaco Editor with independent tab state per language (switching tabs preserves local edits).
   - Starter templates and language-specific syntax highlighting.
   - Batch standard input (`stdin`) sent cleanly before container execution.
   - Multi-line terminal console displaying wall time, exit status, and formatted compiler/runtime outputs.

3. **Isolated & Hardened Code Execution**:
   - Compiles and runs in **Python 3.11**, **Node.js 20 LTS**, **C (GCC 12)**, **C++ (G++ 12)**, **Java 17**, and **C# (Mono 6.8 / C# 6)**.
   - Runs in disposable containers with `--network none`, `--memory=128m`, `--cpus=0.5`, `--pids-limit=64`, `--read-only`, non-root user `1001:1001`, and dropped Linux capabilities (`--cap-drop=ALL`).
   - Deterministic container tracking and cleanup: processes killed on timeout (3s) or output limit breach (64KB) leave zero orphan containers.

4. **Security & Authentication**:
   - NextAuth with PostgreSQL/Prisma adapter (Credentials, Google, GitHub).
   - Server-enforced Administrative Role-Based Access Control (`ADMIN` role check on `/api/admin/users`).
   - Server-to-server (S2S) signed HMAC-SHA256 assertions preventing direct unauthorized access to internal execution APIs.
   - Per-user and per-IP sliding-window rate limiting on execution endpoints.
   - Zero credential leaks (password hashes stripped from API responses, zero plaintext logging).

---

## Supported Programming Languages & Runtimes

| Language | Runtime / Compiler | Version | Execution Command |
|---|---|---|---|
| **Python** | Python 3 | 3.11.2 | `python3 /sandbox/main.py` |
| **JavaScript** | Node.js LTS | 20.20.2 | `node /sandbox/main.js` |
| **C** | GCC | 12.2.0 | `gcc -O2 /sandbox/main.c -o /sandbox/main && /sandbox/main` |
| **C++** | G++ | 12.2.0 | `g++ -O2 /sandbox/main.cpp -o /sandbox/main && /sandbox/main` |
| **Java** | OpenJDK Headless | 17.0.21 | `javac /sandbox/Main.java && java -cp /sandbox Main` |
| **C#** | Mono C# Compiler | 6.8.0.105 | `mcs /sandbox/Program.cs -out:/sandbox/app.exe && mono /sandbox/app.exe` |

---

## Project Structure

```
Visualize-x/
├── app/                          # Next.js 14 Frontend Application
│   ├── src/app/                  # App Router pages and API routes
│   │   ├── (app)/admin/          # Protected Admin Dashboard
│   │   ├── (app)/onlineIDE/      # In-browser IDE
│   │   ├── (pages)/visualizer/   # Sorting visualizer page
│   │   └── api/                  # Authenticated route handlers & S2S proxies
│   ├── src/components/Algorithm/ # D3 and DOM visualizer components
│   ├── src/utils/algorithms/     # 18 audited sorting algorithms
│   ├── prisma/                   # Prisma schema & PostgreSQL migrations
│   └── Dockerfile                # Production Next.js multi-stage image
├── server/                       # Elysia.js / Bun Execution Worker
│   ├── src/                      # API controllers, models, and routes
│   │   ├── controllers/          # Code execution & saved code handlers
│   │   ├── Services/             # SandboxManager Docker execution engine
│   │   └── helper/               # S2S assertion verifier & status checks
│   ├── __test__/                 # Real Docker execution integration test suite
│   ├── Dockerfile                # Production Elysia API image
│   ├── DockerFile.runner         # Multi-language compiler sandbox image
│   └── bench-mark.ts             # Performance and latency benchmark harness
├── docs/                         # In-depth engineering documentation
│   ├── IMPLEMENTATION_AUDIT.md   # Complete vulnerability audit & fixes
│   ├── DEPLOYMENT_VPS.md         # Linux VPS production setup guide
│   ├── SECURITY.md               # Container hardening & threat model
│   └── ARCHITECTURE.md           # System design & request flow specs
├── docker-compose.yml            # Production multi-service orchestration
├── Caddyfile                     # Reverse proxy configuration with automatic TLS
└── .env.example                  # Environment configuration template
```

---

## Local Development Quickstart

### Prerequisites
- [Bun](https://bun.sh/) (v1.1+)
- [Node.js](https://nodejs.org/) (v20+)
- [Docker](https://www.docker.com/) (running)

### 1. Build the Runner Sandbox Image
```bash
docker build -t visualizex-runner:latest -f server/DockerFile.runner server/
```

### 2. Setup and Run the Execution Worker (Backend)
```bash
cd server
bun install
bun run dev
```

### 3. Setup and Run the Frontend
```bash
cd app
npm install
npx prisma generate
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Automated Tests

### 1. Frontend Algorithm & Security Tests
Tests all 18 sorting algorithms across edge cases (empty, duplicates, reverse-sorted, negative numbers) and verifies token/rate-limiting security:
```bash
cd app
npm test
```

### 2. Backend Unit & Real Docker Integration Tests
Tests validation, limits, error codes, and runs real programs in Docker across all 6 languages:
```bash
cd server
bun test
```

---

## Production Deployment on Linux VPS (Backend for Vercel Frontend)

The application uses a modern hybrid deployment model:
- **Frontend (`/app`)**: Deployed on **Vercel** (`https://your-app.vercel.app`).
- **Execution Backend (`/server`)**: Deployed on **Linux VPS** (`https://api.yourdomain.com`).

See [`docs/DEPLOYMENT_VPS.md`](docs/DEPLOYMENT_VPS.md) for the complete, step-by-step VPS deployment guide.

### Quick Start (Linux VPS)
```bash
# 1. Clone repository on your VPS
git clone https://github.com/your-username/visualize-x.git /opt/visualize-x
cd /opt/visualize-x

# 2. Configure environment (set API_DOMAIN and shared INTERNAL_SERVICE_SECRET)
cp .env.example .env
nano .env

# 3. Create host workspace directory for Docker sandbox mounts
sudo mkdir -p /tmp/visualizex-workspaces && sudo chmod 777 /tmp/visualizex-workspaces

# 4. Build runner sandbox image (contains all 6 language runtimes)
docker build -t visualizex-runner:latest -f server/DockerFile.runner server/

# 5. Start backend services (Caddy HTTPS + Elysia API + MongoDB)
docker compose build
docker compose up -d

# 6. Verify health
curl https://api.yourdomain.com/health
curl https://api.yourdomain.com/ready
```

### Vercel Frontend Configuration
In your Vercel Project Settings -> Environment Variables, add:
- `INTERNAL_API_URL`: `https://api.yourdomain.com` (your VPS backend URL)
- `INTERNAL_SERVICE_SECRET`: *(Same 32-byte hex secret configured on the VPS)*
- `DATABASE_URL`: *(PostgreSQL connection string for NextAuth)*
- `NEXTAUTH_SECRET`: *(NextAuth encryption key)*
- `NEXTAUTH_URL`: `https://your-app.vercel.app`

---

## Documentation Links

- [Audit & Remediation Report](docs/IMPLEMENTATION_AUDIT.md)
- [VPS Deployment Guide](docs/DEPLOYMENT_VPS.md)
- [Security & Container Isolation](docs/SECURITY.md)
- [System Architecture Specification](docs/ARCHITECTURE.md)
