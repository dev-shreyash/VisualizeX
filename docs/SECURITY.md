# VisualizeX: Application Security & Container Isolation Architecture

**Classification**: Application Security Architecture & Hardening Guide  
**Audience**: Security Engineers, DevOps Engineers, System Administrators

---

## 1. Threat Model & Attack Surface

VisualizeX provides browser-based multi-language code execution. Any system accepting arbitrary user code faces severe security risks:

1. **Remote Code Execution (RCE) on Host**: Malicious code attempting to execute host OS commands or access host files.
2. **Container Escape & Privilege Escalation**: Exploitation of Linux kernel vulnerabilities or Docker misconfigurations to gain root privileges on the VPS.
3. **Denial of Service (DoS)**: Fork bombs, CPU exhaustion, memory allocation loops, and unbounded output generation.
4. **Network & SSRF Attacks**: Attempts to scan local VPS networks, access cloud metadata endpoints (`169.254.169.254`), or interact with internal databases.
5. **Data Tampering & Unauthorized Access**: Reading, modifying, or deleting other users' saved code and administrative resources.
6. **Docker Daemon Hijacking**: Gaining access to the Docker socket, which provides effective root access over the host.

---

## 2. Multi-Layer Defense-in-Depth Architecture

```
Layer 1: Edge & Network (Reverse Proxy & Rate Limiting)
  └── TLS termination, UFW firewall, IP sliding-window rate limits (Next.js)

Layer 2: Authentication & Authorization (S2S Assertion)
  └── Server-side session verification, ADMIN role enforcement, scoped HMAC-SHA256 tokens

Layer 3: Process & Worker Isolation
  └── Dedicated execution worker, unexposed internal port, non-root user

Layer 4: Docker Sandbox Container Restrictions
  └── --network none, --read-only, --cap-drop=ALL, non-root UID 1001, limits

Layer 5: Rootless Docker Host Isolation
  └── Rootless daemon running in unprivileged user namespace
```

---

## 3. Container Isolation Controls

Every untrusted program executes inside a short-lived disposable container launched with strict security restrictions:

```bash
docker run -i \
  --name="vx-exec-<UUID>" \
  --network none \
  --memory=128m \
  --memory-swap=128m \
  --cpus=0.5 \
  --pids-limit=64 \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=16m \
  --security-opt=no-new-privileges:true \
  --cap-drop=ALL \
  --user 1001:1001 \
  -v /tmp/visualizex-workspaces/<runId>:/sandbox:rw \
  visualizex-runner:latest \
  <runCmd>
```

### Explanation of Security Flags:

1. **`--network none`**:
   - Completely disables network stack and network interfaces inside the container.
   - Prevents SSRF attacks, outbound command-and-control communication, package downloads, and internal network port scanning.
2. **`--memory=128m` and `--memory-swap=128m`**:
   - Restricts memory allocation to 128 MB and prevents swapping to host disk.
   - Eliminates host out-of-memory (OOM) crashes from allocation loops.
3. **`--cpus=0.5`**:
   - Caps container CPU utilization to 50% of a single core.
   - Prevents CPU-bound computation loops from starving VPS system processes.
4. **`--pids-limit=64`**:
   - Limits total concurrent processes/threads within the container to 64.
   - Defends against `fork()` bombs (`:(){ :|:& };:`).
5. **`--read-only`**:
   - Mounts the container root filesystem as strictly read-only.
   - Prevents modification of system libraries, binaries, or persistent disk tampering.
6. **`--tmpfs /tmp:rw,noexec,nosuid,size=16m`**:
   - Provides an in-memory temporary filesystem mounted with `noexec` (cannot execute binaries from `/tmp`), `nosuid` (ignores SUID bits), and a strict 16 MB size ceiling.
7. **`--security-opt=no-new-privileges:true`**:
   - Prevents child processes from gaining additional privileges via `setuid` or `setgid` binaries.
8. **`--cap-drop=ALL`**:
   - Strips all Linux kernel capabilities (`CAP_SYS_ADMIN`, `CAP_NET_ADMIN`, `CAP_CHOWN`, etc.).
   - Disables administrative kernel syscalls, chrooting, raw sockets, and namespace manipulation.
9. **`--user 1001:1001`**:
   - Forces execution under non-root user `runner` (UID 1001, GID 1001).

---

## 4. Execution Lifecycle & Orphan Container Prevention

### 4.1 Deterministic Container Tracking
Previous implementations killed the local `docker` CLI process with `SIGKILL`, leaving orphan containers running in the background.

In the hardened architecture:
- Each container is assigned a unique name `vx-exec-${randomUUID}`.
- When an execution timeout (3s) or output limit (64KB) occurs:
  1. `docker kill vx-exec-<UUID>` is invoked directly against the container.
  2. The local process is terminated.
  3. The `finally` block executes `docker rm -f vx-exec-<UUID>`, ensuring no orphan container remains.

### 4.2 Byte-Accurate Output Limiting
Output streams (`stdout` and `stderr`) are tracked in raw buffer bytes:
- If combined bytes exceed `MAX_OUTPUT_BYTES` (64 KB), the container is immediately aborted and killed.
- Memory consumption remains strictly bounded regardless of stream velocity.

---

## 5. Docker Daemon Security & Rootless Architecture

> [!WARNING]
> Mounting `/var/run/docker.sock` grants effective root access to the entire host machine. The public-facing Next.js application has **zero** access to the Docker socket.

### Separation of Responsibilities:
- **Public API (Next.js)**: Runs in `visualizex-app`, handles user authentication, session cookies, and public routing. Has **no** Docker daemon access.
- **Execution Worker (Elysia)**: Runs in `visualizex-api` on an internal Docker network (`visualizex-network`). Exclusively communicates with the designated execution Docker daemon.
- **Rootless Docker Daemon**:
  - Recommended for VPS deployment (`dockerd-rootless-setuptool.sh`).
  - Runs under an unprivileged user (`dockerrunner`).
  - Container root maps to an unprivileged host UID via user namespaces (`subuid`/`subgid`).

---

## 6. Authentication, Authorization & S2S Assertions

### 6.1 Server-to-Server Assertion Signing
Browser clients never call the Elysia execution worker directly. All requests pass through Next.js route handlers:

1. Next.js validates user session or IP.
2. Next.js signs a short-lived (60s) HMAC-SHA256 assertion:
   ```json
   {
     "sub": "user_123",
     "role": "USER",
     "scope": "code:execute",
     "nonce": "4a2b9f8e1c3d...",
     "iat": 1730460000,
     "exp": 1730460060
   }
   ```
3. Next.js calls internal Elysia endpoint with `Authorization: Bearer <assertion>`.
4. Elysia verifies signature using `INTERNAL_SERVICE_SECRET` with constant-time comparison (`crypto.timingSafeEqual`) and asserts that `scope` matches.

### 6.2 Saved Code Ownership
- Code retrieval and updates derive user identity strictly from `session.user.username`.
- Elysia validates that `auth.payload.sub === body.username` (or `auth.payload.role === "ADMIN"`).
- Users cannot access, overwrite, or delete code belonging to other accounts.

### 6.3 Administrative Role-Based Access Control (RBAC)
- All admin route handlers (`/api/admin/users`) enforce `getServerSession(authOptions)` and require `session.user.role === "ADMIN"`.
- Requests from normal users or unauthenticated clients are rejected with HTTP 401 or 403.
- Password hashes are completely excluded from database queries (`select: { password: false }`).

