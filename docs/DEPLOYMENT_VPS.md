# VisualizeX Backend: Linux VPS Deployment Guide (Direct IP + Vercel Frontend)

This guide provides exact, step-by-step instructions for deploying the **VisualizeX Execution Backend (`/server`)** directly using your **Linux VPS IP Address** (e.g. `http://<YOUR_VPS_IP>:5000`), with MongoDB running in **MongoDB Atlas Cloud** and the **Frontend (`/app`) hosted on Vercel**. No domain name or reverse proxy setup is required.

---

## 1. System Architecture & Request Flow

```
┌─────────────────────────────────┐
│        User Browser             │
└───────────────┬─────────────────┘
                │
                │ HTTPS (Standard Vercel domain or custom domain)
                ▼
┌────────────────────────────────────────────────────────┐
│  Vercel Edge & Serverless Deployment (/app)            │
│  - Next.js 14 App Router                               │
│  - User Authentication (NextAuth + PostgreSQL Database)│
│  - Rate Limiting (Sliding Window per IP/User)          │
│  - Signs HMAC-SHA256 Server Assertion Token            │
└───────────────────────┬────────────────────────────────┘
                        │
                        │ S2S HTTP Request (Server-to-Server)
                        │ Endpoint: http://<YOUR_VPS_IP>:5000/api/execute
                        │ Header: Authorization: Bearer <signed-token>
                        ▼
┌────────────────────────────────────────────────────────┐
│  Linux VPS (Ubuntu 22.04/24.04 LTS)                    │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │ Elysia.js / Bun Execution Worker (:5000)       │   │
│   │ - Directly exposed on port 5000                │   │
│   │ - Verifies HMAC-SHA256 Assertion & Scope       │   │
│   │ - Concurrency Semaphore (MAX_CONCURRENT=5)     │   │
│   │ - Connects to MongoDB Atlas Cloud (Saved Code) │   │
│   └───────────────────────┬────────────────────────┘   │
│                           │ Docker Socket              │
│                           ▼                            │
│   ┌────────────────────────────────────────────────┐   │
│   │ Isolated Runner Container (visualizex-runner)  │   │
│   │ - Non-root sandbox user (UID 1001)             │   │
│   │ - --network none, --read-only, --tmpfs /tmp    │   │
│   │ - Memory 128MB, CPU 0.5, PIDs limit 64         │   │
│   │ - 3s execution timeout & guaranteed cleanup    │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Server Specifications & Firewall

### 2.1 Server Requirements
- **OS**: Ubuntu 22.04 LTS or 24.04 LTS (x86_64)
- **Specs**: 2 vCPU, 4 GB RAM, 20 GB SSD (or higher)
- **No Domain Required**: Uses your public VPS IP address (e.g. `123.45.67.89`)

### 2.2 Configure Firewall (UFW)
Open SSH (22) and the Elysia Execution Backend port (5000):
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
sudo ufw status
```

---

## 3. Install Docker Engine on VPS

```bash
# 1. Install prerequisites
sudo apt-get update && sudo apt-get install -y curl git ufw ca-certificates gnupg

# 2. Add Docker official GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3. Install Docker and Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Verify Docker
docker --version
docker compose version
```

---

## 4. Setup Host Workspace Directory

Create the isolated host directory where code files will be written prior to mounting in runner containers:
```bash
sudo mkdir -p /tmp/visualizex-workspaces
sudo chmod 777 /tmp/visualizex-workspaces
```

---

## 5. Deploy the Backend Code

### 5.1 Clone Repository
```bash
git clone <your-repository-url> /opt/visualizex
cd /opt/visualizex
```

### 5.2 Build the Multi-Language Sandbox Runner Image
The runner image contains all 6 compilers and runtimes (Python 3.11, Node.js 20, GCC 12, G++ 12, OpenJDK 17, Mono 6.8):
```bash
docker build -t visualizex-runner:latest -f server/DockerFile.runner server/
```

### 5.3 Configure VPS Environment (`.env`)
Create the `.env` file on your VPS:
```bash
cp .env.example .env
nano .env
```

Set the following variables:
```ini
# 1. Port for execution worker
PORT=5000

# 2. Secret shared between Vercel and VPS
# Generate using: openssl rand -hex 32
INTERNAL_SERVICE_SECRET=paste_your_32_byte_hex_secret_here
REQUIRE_S2S_AUTH=true

# 3. MongoDB Atlas Cloud Connection String
# Paste your full MongoDB Atlas connection URI:
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/CODES?retryWrites=true&w=majority
MONGODB_DB_NAME=CODES
MONGODB_CODE_COLLECTION=users

# 4. Sandbox limits
MAX_CONCURRENT=5
EXECUTION_TIMEOUT_MS=3000
HOST_WORKSPACE_PATH=/tmp/visualizex-workspaces
DOCKER_SOCKET_PATH=/var/run/docker.sock
RUNNER_IMAGE=visualizex-runner:latest
CLIENT_URL=*
```

### 5.4 Start Backend Service
```bash
docker compose up -d
```

Verify that `visualizex-api` is running and healthy on port 5000:
```bash
docker compose ps
```
Expected output:
```
NAME             IMAGE                   STATUS                    PORTS
visualizex-api   visualizex-api:latest   Up (healthy)              0.0.0.0:5000->5000/tcp
```

---

## 6. Configure Vercel Frontend (`/app`)

In your **Vercel Project Dashboard** (`https://vercel.com`):
1. Navigate to **Project Settings** -> **Environment Variables**.
2. Add the following environment variables:

| Variable Name | Value | Description |
|---|---|---|
| `INTERNAL_API_URL` | `http://<YOUR_VPS_IP>:5000` | Direct HTTP endpoint of your VPS backend |
| `INTERNAL_SERVICE_SECRET` | *(Same hex secret from VPS `.env`)* | Shared HMAC-SHA256 signing secret |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string for NextAuth (Neon, Supabase, or RDS) |
| `NEXTAUTH_SECRET` | *(32-byte base64 string)* | NextAuth session encryption key |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production URL of your Vercel frontend |
| `NEXT_PUBLIC_API_URL` | `http://<YOUR_VPS_IP>:5000/api` | Optional public API endpoint |
| `GOOGLE_CLIENT_ID` | *(Optional)* | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | *(Optional)* | Google OAuth Client Secret |
| `GITHUB_CLIENT_ID` | *(Optional)* | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | *(Optional)* | GitHub OAuth Client Secret |

3. Trigger a redeployment on Vercel so the new environment variables take effect.

---

## 7. Verification & Health Checks

### 7.1 Verify VPS Backend Health
From your local terminal or VPS, verify the endpoints:
```bash
# Check liveness
curl http://<YOUR_VPS_IP>:5000/health
# Response: {"status":"OK","uptime":...,"timestamp":"..."}

# Check readiness (MongoDB Atlas & Docker daemon status)
curl http://<YOUR_VPS_IP>:5000/ready
# Response: {"ready":true,"database":"connected","docker":"available","activeExecutions":0,"maxConcurrent":5}
```

### 7.2 Verify S2S Assertion Protection
Confirm that untrusted public requests without a valid assertion from Vercel are rejected:
```bash
curl -i -X POST http://<YOUR_VPS_IP>:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"language":"python","code":"print(\"test\")"}'
```
Expected response:
```
HTTP/1.1 401 Unauthorized
{"error":"Missing or malformed Authorization header","status":401}
```

### 7.3 Test End-to-End Execution via Vercel Frontend
Open your Vercel deployment in your browser:
1. Navigate to `/onlineIDE`.
2. Select **Python** and run:
   ```python
   print("Hello from Vercel through VPS Sandbox!")
   ```
3. Click **Run Code**.
4. The execution output will appear in the IDE terminal.
5. Repeat for JavaScript, C, C++, Java, and C# to confirm all runtimes.

---

## 8. Maintenance & Operational Procedures

### 8.1 View Real-Time Worker Logs
```bash
docker compose logs -f visualizex-api
```

### 8.2 View Reverse Proxy Access Logs
```bash
docker compose logs -f reverse-proxy
```

### 8.3 Restarting Backend Services
```bash
# Graceful restart of the backend stack
docker compose restart

# Complete teardown and restart
docker compose down
docker compose up -d
```

### 8.4 MongoDB Atlas Cloud Backups
Because you are using **MongoDB Atlas Cloud**, automated point-in-time restores and continuous cluster backups are managed natively by Atlas. You can trigger on-demand backups or review snapshot history directly in the **MongoDB Atlas Web Console** under your cluster's **Backup** tab without running local cron jobs.

### 8.5 Updating the Backend (Zero Downtime)
When pushing code changes to `server/`:
```bash
cd /opt/visualizex
git pull origin main
docker compose build visualizex-api
docker compose up -d --no-deps visualizex-api
```
Caddy will automatically keep serving traffic and reconnect as soon as the updated container passes its healthcheck.
