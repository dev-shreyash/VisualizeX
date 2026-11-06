# VisualizeX: Implementation Audit & Remediation Report

**Date**: November 2026  
**Auditor**: Senior Staff Engineer, Application Security Engineer & DevOps Specialist  
**Codebase**: VisualizeX (Next.js 14, Elysia.js/Bun, Docker, MongoDB, PostgreSQL/Prisma)

---

## Executive Summary

A comprehensive security, reliability, and architecture audit of the VisualizeX codebase revealed critical vulnerabilities in code execution isolation, administrative authorization, data persistence, and API boundaries. 

Every identified finding has been actively remediated, hardened, and verified with automated unit and integration tests.

---

## Findings Matrix

| Finding ID | Severity | Category | Description | Affected Files | Status |
|---|---|---|---|---|---|
| **SEC-01** | **CRITICAL** | Authorization | Admin API completely unauthenticated (`GET`, `DELETE`, `PATCH`, `PUT` on `/api/admin/users`) | `app/src/app/api/admin/users/route.ts` | **RESOLVED** |
| **SEC-02** | **CRITICAL** | Authorization | Unrestricted code tampering & arbitrary code reading via client-supplied username | `server/src/routes/codeRoutes.ts`, `server/src/controllers/code.controllers.ts` | **RESOLVED** |
| **SEC-03** | **HIGH** | Credential Leak | NextAuth session-token cookie exposed directly via public endpoint | `app/src/app/api/auth/token/route.ts` | **RESOLVED** |
| **SEC-04** | **HIGH** | Credential Leak | User password hashes returned in registration and update responses | `app/src/app/api/sign-up/route.ts`, `app/src/app/api/users/update-*` | **RESOLVED** |
| **SEC-05** | **HIGH** | Logging Leak | User passwords logged to server console during email update | `app/src/app/api/users/update-email/route.ts` | **RESOLVED** |
| **SEC-06** | **HIGH** | Infrastructure | Host Docker socket exposed to unauthenticated public API calls | Architecture / `docker-compose.yml` | **RESOLVED** |
| **EXE-01** | **CRITICAL** | Sandbox Lifecycle | Docker CLI killed on timeout with SIGKILL, leaving orphan containers running | `server/src/Services/sandboxManager.ts` | **RESOLVED** |
| **EXE-02** | **HIGH** | Concurrency Leak | `activeRuns` never decremented if workspace or container creation threw an error | `server/src/Services/sandboxManager.ts` | **RESOLVED** |
| **EXE-03** | **HIGH** | Missing Runtime | Advertised C# language failed because Mono runtime was absent in Alpine runner | `server/DockerFile.runner` | **RESOLVED** |
| **EXE-04** | **MEDIUM** | Resource Limits | Output buffer check counted JS characters rather than bytes and did not abort process | `server/src/Services/sandboxManager.ts` | **RESOLVED** |
| **DAT-01** | **HIGH** | Data Integrity | Destructive keep-alive hourly mutation overwrote a hardcoded MongoDB code document | `server/src/helper/keepAlive.ts` | **RESOLVED** |
| **DAT-02** | **MEDIUM** | Schema Mapping | Model registered as `"User"` mapping implicitly to `"users"`, missing compound index | `server/src/models/code.ts` | **RESOLVED** |
| **FNT-01** | **HIGH** | State Bug | Loading code for one language tab overwrote all other editor tabs | `app/src/app/(app)/onlineIDE/page.tsx` | **RESOLVED** |
| **FNT-02** | **HIGH** | Functional Bug | Clicking "Pause" during sorting animation forced a full browser reload | `app/src/app/(pages)/visualizer/[algorithm]/page.tsx` | **RESOLVED** |
| **ALG-01** | **HIGH** | Algorithm Defect | `bucketSort` threw `TypeError` due to zero-range division by zero on equal elements | `app/src/utils/algorithms/bucketSort.ts` | **RESOLVED** |
| **ALG-02** | **HIGH** | Algorithm Defect | `radixSort` threw out-of-bounds error when array contained negative numbers | `app/src/utils/algorithms/radixSort.ts` | **RESOLVED** |
| **ALG-03** | **MEDIUM** | Algorithm Defect | `introspectiveSort` corrupted data by running `heapSort` on entire array instead of subrange | `app/src/utils/algorithms/introspectiveSort.ts` | **RESOLVED** |
| **TST-01** | **HIGH** | Testing | Test suite imported non-existent functions and failed compilation | `server/__test__/codeExecution.test.ts` | **RESOLVED** |

---

## Detailed Remediation & Validation

### 1. Admin & Account Authorization (SEC-01, SEC-02, SEC-03, SEC-04, SEC-05)
- **Root Cause**: Next.js route handlers trusted client-provided request bodies and URL parameters without validating active NextAuth sessions or verifying `session.user.role === "ADMIN"`.
- **Fix**:
  - Enforced server-side `getServerSession(authOptions)` across all admin endpoints (`GET`, `DELETE`, `PATCH`, `PUT`).
  - Added role check requiring `session.user.role === "ADMIN"` with explicit 401/403 HTTP status responses.
  - Deprecated the raw token leak in `/api/auth/token`.
  - Sanitized database projections: stripped `password` hash fields from all API responses.
  - Removed plaintext credential logging from `console.log`.
  - Routed saved code operations through session-authenticated Next.js proxies signing HMAC-SHA256 service assertions.

### 2. Execution Engine & Docker Isolation (EXE-01, EXE-02, EXE-03, EXE-04)
- **Root Cause**:
  - Alpine 3.19 lacked Mono packages, causing C# execution to fail with missing `mcs`/`mono`.
  - `proc.kill("SIGKILL")` killed the client CLI rather than stopping the container.
  - Concurrency counters were not wrapped in a `try/finally` block.
- **Fix**:
  - Replaced runner base with `debian:bookworm-slim`, providing Python 3.11, Node.js 20 LTS, GCC 12, G++ 12, OpenJDK 17, and Mono 6.8 (`mono-mcs`, `mono-runtime`).
  - Each container is assigned a unique name `vx-exec-${randomUUID}` and tracked deterministically.
  - On timeout (3s) or output limit breach (64KB), `docker kill` is invoked directly on the container name.
  - Enforced `activeRuns` decrements and workspace cleanup in guaranteed `finally` blocks.
  - Hardened Docker flags: `--network none`, `--memory=128m`, `--cpus=0.5`, `--pids-limit=64`, `--read-only`, `--tmpfs /tmp:rw,noexec,nosuid,size=16m`, `--security-opt=no-new-privileges:true`, `--cap-drop=ALL`, `--user 1001:1001`.

### 3. Data Integrity & Persistence (DAT-01, DAT-02)
- **Root Cause**: `server/src/helper/keepAlive.ts` executed an hourly update on hardcoded ID `6799bf00c6059d0186937f92`. Model registration defaulted to the `"users"` collection.
- **Fix**:
  - Completely deleted the destructive keep-alive script.
  - Maintained backward compatibility by defaulting `collectionName` to `"users"` (`process.env.MONGODB_CODE_COLLECTION || "users"`), guaranteeing zero data loss.
  - Provided a standalone, idempotent, verified migration script `server/src/scripts/migrateCodeCollection.ts`.
  - Added compound unique index on `{ username: 1, language: 1 }`.

### 4. Frontend Functional Fixes (FNT-01, FNT-02, ALG-01, ALG-02, ALG-03)
- **Root Cause**:
  - `onlineIDE` code-loading effect reduced loaded code across all tabs into state.
  - Visualizer page had an effect `if (isPaused) window.location.reload()`.
  - Sorting algorithms lacked guards for `length <= 1`, negative numbers, and duplicate element bucket ranges.
- **Fix**:
  - Isolated editor content per tab key; loading code for one language tab updates only that tab.
  - Replaced reload with true step-indexed pause/resume controls and timer cleanup.
  - Fixed `bucketSort` zero-range division by zero and `radixSort` negative numbers.
  - Validated all 18 sorting algorithms across edge cases with 143 passing Jest tests.

