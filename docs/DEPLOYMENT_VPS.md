# VisualizeX Backend: Linux VPS Deployment Guide (Vercel Frontend Hybrid)

This guide provides exact, step-by-step instructions for deploying the **VisualizeX Execution Backend (`/server`)** to a Linux VPS (Ubuntu 22.04/24.04 LTS or Debian 12), while the **Frontend (`/app`) is hosted on Vercel**.

---

## 1. System Architecture & Request Flow

```
┌─────────────────────────────────┐
│        User Browser             │
└───────────────┬─────────────────┘
                │
                │ HTTPS (User actions, code editor, visualizer)
                ▼
┌────────────────────────────────────────────────────────┐
│  Vercel Edge & Serverless Deployment (/app)            │
│  - Next.js 14 App Router                               │
│  - User Authentication (NextAuth + PostgreSQL Database)│
│  - Rate Limiting (Sliding Window per IP/User)          │
│  - Signs HMAC-SHA256 Server Assertion Token            │
└───────────────────────┬────────────────────────────────┘
                        │
                        │ S2S HTTPS (Bearer signed assertion)
                        │ Endpoint: https://api.yourdomain.com/api/execute
                        ▼
┌────────────────────────────────────────────────────────┐
│  Linux VPS (Ubuntu 22.04/24.04 LTS)                    │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │ Caddy Reverse Proxy (:80 / :443)               │   │
│   │ - Automatic Let's Encrypt TLS Certificate      │   │
│   │ - Injects Security Headers                     │   │
│   └───────────────────────┬────────────────────────┘   │
│                           │ Internal Docker Bridge     │
│                           ▼                            │
│   ┌────────────────────────────────────────────────┐   │
│   │ Elysia.js / Bun Execution Worker (:5000)       │   │
│   │ - Verifies HMAC-SHA256 Assertion & Scope       │   │
│   │ - Concurrency Semaphore (MAX_CONCURRENT=5)     │   │
│   │ - Connects to MongoDB (Saved Code)             │   │
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

---

## 2. Server Specifications & Firewall

### 2.1 Server Requirements
- **OS**: Ubuntu 22.04 LTS or 24.04 LTS (x86_64)
- **Specs**: 2 vCPU, 4 GB RAM, 20 GB SSD (or higher)
- **DNS**: An `A` record pointing to your VPS IP (e.g. `api.yourdomain.com` -> `203.0.113.10`)

### 2.2 Configure Firewall (UFW)
Only SSH, HTTP (80 for Let's Encrypt challenge & redirect), and HTTPS (443) must be open:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
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

Ensure the following variables are configured:
```ini
# 1. Your domain for the API (must have an A record pointing to this VPS)
API_DOMAIN=api.yourdomain.com
LETSENCRYPT_EMAIL=admin@yourdomain.com

# 2. Secret shared between Vercel and VPS
# Generate using: openssl rand -hex 32
INTERNAL_SERVICE_SECRET=a8f3b49c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a
REQUIRE_S2S_AUTH=true

# 3. MongoDB connection
# Use local container (default):
MONGODB_URL=mongodb://mongo:27017/CODES
MONGODB_DB_NAME=CODES
MONGODB_CODE_COLLECTION=users

# Or use MongoDB Atlas:
# MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/CODES?retryWrites=true&w=majority

# 4. Sandbox limits
MAX_CONCURRENT=5
EXECUTION_TIMEOUT_MS=3000
HOST_WORKSPACE_PATH=/tmp/visualizex-workspaces
DOCKER_SOCKET_PATH=/var/run/docker.sock
RUNNER_IMAGE=visualizex-runner:latest
CLIENT_URL=*
```

### 5.4 Start Backend Services
```bash
docker compose build
docker compose up -d
```

Verify that all three services are running and healthy:
```bash
docker compose ps
```
Expected output:
```
NAME               IMAGE                   STATUS                    PORTS
visualizex-api     visualizex-api:latest   Up (healthy)              5000/tcp
visualizex-mongo   mongo:7.0               Up (healthy)              27017/tcp
visualizex-proxy   caddy:2.8-alpine        Up                        0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

---

## 6. Configure Vercel Frontend (`/app`)

In your **Vercel Project Dashboard** (`https://vercel.com`):
1. Navigate to **Project Settings** -> **Environment Variables**.
2. Add the following environment variables:

| Variable Name | Value | Description |
|---|---|---|
| `INTERNAL_API_URL` | `https://api.yourdomain.com` | Public HTTPS URL of your VPS backend |
| `INTERNAL_SERVICE_SECRET` | *(Same hex secret from VPS `.env`)* | Shared HMAC-SHA256 signing secret |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string for NextAuth (Neon, Supabase, or RDS) |
| `NEXTAUTH_SECRET` | *(32-byte base64 string)* | NextAuth session encryption key |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production URL of your Vercel frontend |
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com/api` | Optional public API endpoint |
| `GOOGLE_CLIENT_ID` | *(Optional)* | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | *(Optional)* | Google OAuth Client Secret |
| `GITHUB_CLIENT_ID` | *(Optional)* | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | *(Optional)* | GitHub OAuth Client Secret |

3. Trigger a redeployment on Vercel so the new environment variables take effect.

---

## 7. Verification & Health Checks

### 7.1 Verify VPS Backend Health
From any machine, verify the HTTPS endpoints on your VPS:
```bash
# Check liveness
curl https://api.yourdomain.com/health
# Response: {"status":"OK","uptime":...,"timestamp":"..."}

# Check readiness (MongoDB & Docker daemon status)
curl https://api.yourdomain.com/ready
# Response: {"ready":true,"database":"connected","docker":"available","activeExecutions":0,"maxConcurrent":5}
```

### 7.2 Verify S2S Assertion Protection
Confirm that untrusted public requests without a valid assertion from Vercel are rejected:
```bash
curl -i -X POST https://api.yourdomain.com/api/execute \
  -H "Content-Type: application/json" \
  -d '{"language":"python","code":"print(\"test\")"}'
```
Expected response:
```
HTTP/2 401 Unauthorized
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

### 8.4 Automated Daily MongoDB Backup (Cron)
If using the local MongoDB container on the VPS, set up automated daily backups:
```bash
sudo mkdir -p /opt/visualizex/backups/mongo

# Create backup script
sudo tee /opt/visualizex/backup-mongo.sh > /dev/null << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/visualizex/backups/mongo"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec visualizex-mongo mongodump --db CODES --archive > "${BACKUP_DIR}/mongo_CODES_${TIMESTAMP}.archive"
# Delete backups older than 14 days
find "${BACKUP_DIR}" -type f -name "*.archive" -mtime +14 -delete
EOF

sudo chmod +x /opt/visualizex/backup-mongo.sh

# Add to crontab to run daily at 3:00 AM
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/visualizex/backup-mongo.sh") | crontab -
```

### 8.5 Updating the Backend (Zero Downtime)
When pushing code changes to `server/`:
```bash
cd /opt/visualizex
git pull origin main
docker compose build visualizex-api
docker compose up -d --no-deps visualizex-api
```
Caddy will automatically keep serving traffic and reconnect as soon as the updated container passes its healthcheck.
