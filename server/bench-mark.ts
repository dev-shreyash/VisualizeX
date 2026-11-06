import { writeFileSync } from "fs";
import crypto from "crypto";

const TOTAL_REQUESTS = 40;
const CONCURRENT_WORKERS = 5;
const WARMUP_REQUESTS = 5;
const ROUNDS = 3;

const API_URL = process.env.BENCHMARK_API_URL || "http://localhost:5000/api/execute";
const SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET || "default-insecure-visualizex-secret-change-in-prod";

function createAssertion(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "benchmark-runner",
    role: "ADMIN",
    scope: "code:execute",
    nonce: crypto.randomBytes(8).toString("hex"),
    iat: now,
    exp: now + 300,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const b64 = (obj: any) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const h = b64(header);
  const p = b64(payload);
  const data = `${h}.${p}`;
  const sig = crypto
    .createHmac("sha256", SERVICE_SECRET)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${data}.${sig}`;
}

const BENCHMARK_PAYLOADS = [
  {
    language: "python",
    expected: "3, 9, 10, 27, 38, 43, 82",
    code: `
arr = [38, 27, 43, 3, 9, 82, 10]
arr.sort()
print(", ".join(map(str, arr)))
`,
  },
  {
    language: "javascript",
    expected: "Sorted: 1, 2, 3, 4, 5",
    code: `
const arr = [5, 3, 1, 4, 2];
arr.sort((a, b) => a - b);
console.log("Sorted: " + arr.join(", "));
`,
  },
];

type RequestResult = {
  success: boolean;
  latencyMs: number;
  statusCode: number;
  outputVerified: boolean;
  wallTimeMs?: number;
};

type RoundResult = {
  round: number;
  total: number;
  successCount: number;
  failureCount: number;
  successLatencies: number[];
  failedLatencies: number[];
  totalWallSeconds: number;
};

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

async function executeSingleRequest(payloadIndex = 0): Promise<RequestResult> {
  const payload = BENCHMARK_PAYLOADS[payloadIndex % BENCHMARK_PAYLOADS.length];
  const t0 = performance.now();
  const token = createAssertion();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code: payload.code,
        language: payload.language,
      }),
    });

    const latencyMs = performance.now() - t0;
    const data = await response.json().catch(() => ({}));
    const success = response.ok && (data.exitCode === 0 || data.status === 200);
    const outputVerified = success && typeof data.stdout === "string" && data.stdout.includes(payload.expected);

    return {
      success,
      latencyMs,
      statusCode: response.status,
      outputVerified,
      wallTimeMs: data.wallTimeMs,
    };
  } catch {
    return {
      success: false,
      latencyMs: performance.now() - t0,
      statusCode: 0,
      outputVerified: false,
    };
  }
}

async function runBatch(total: number, concurrency: number): Promise<RoundResult> {
  const successLatencies: number[] = [];
  const failedLatencies: number[] = [];
  let successCount = 0;
  let failureCount = 0;

  const queue = Array.from({ length: total }, (_, i) => i);
  const startTime = performance.now();

  async function worker() {
    while (queue.length > 0) {
      const idx = queue.pop();
      if (idx === undefined) break;

      const res = await executeSingleRequest(idx);
      if (res.success && res.outputVerified) {
        successCount++;
        successLatencies.push(res.latencyMs);
      } else {
        failureCount++;
        failedLatencies.push(res.latencyMs);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, total) }, () => worker())
  );

  const totalWallSeconds = (performance.now() - startTime) / 1000;

  return {
    round: 0,
    total,
    successCount,
    failureCount,
    successLatencies,
    failedLatencies,
    totalWallSeconds,
  };
}

async function runBenchmark() {
  console.log("==========================================================");
  console.log("          VisualizeX Execution Engine Benchmark           ");
  console.log("==========================================================");
  console.log(`Endpoint:            ${API_URL}`);
  console.log(`Concurrency:         ${CONCURRENT_WORKERS} workers`);
  console.log(`Requests/round:      ${TOTAL_REQUESTS}`);
  console.log(`Rounds:              ${ROUNDS}`);
  console.log(`Warmup requests:     ${WARMUP_REQUESTS}`);
  console.log("----------------------------------------------------------");

  console.log(`Executing ${WARMUP_REQUESTS} warmup requests...`);
  const warmupRes = await runBatch(WARMUP_REQUESTS, 2);
  console.log(`Warmup finished: ${warmupRes.successCount}/${WARMUP_REQUESTS} verified.\n`);

  const roundResults: RoundResult[] = [];

  for (let r = 1; r <= ROUNDS; r++) {
    console.log(`Running round ${r}/${ROUNDS}...`);
    const res = await runBatch(TOTAL_REQUESTS, CONCURRENT_WORKERS);
    res.round = r;
    roundResults.push(res);
    const rps = res.totalWallSeconds > 0 ? (res.successCount / res.totalWallSeconds).toFixed(1) : "0";
    console.log(
      `  Round ${r}: ${res.successCount}/${TOTAL_REQUESTS} verified | ` +
      `Duration: ${res.totalWallSeconds.toFixed(2)}s | ${rps} req/s | ` +
      `Avg: ${average(res.successLatencies).toFixed(1)}ms`
    );
  }

  const allSuccessLatencies = roundResults.flatMap((r) => r.successLatencies);
  const allFailedLatencies = roundResults.flatMap((r) => r.failedLatencies);
  const totalSuccess = roundResults.reduce((s, r) => s + r.successCount, 0);
  const totalFail = roundResults.reduce((s, r) => s + r.failureCount, 0);
  const totalTimeSec = roundResults.reduce((s, r) => s + r.totalWallSeconds, 0);
  const totalReq = TOTAL_REQUESTS * ROUNDS;

  const summary = {
    totalRequests: totalReq,
    successfulRequests: totalSuccess,
    failedRequests: totalFail,
    successRate: `${((totalSuccess / totalReq) * 100).toFixed(1)}%`,
    totalWallSeconds: Number(totalTimeSec.toFixed(2)),
    throughputReqSec: Number((totalSuccess / totalTimeSec).toFixed(2)),
    successLatency: {
      avg: Number(average(allSuccessLatencies).toFixed(1)),
      p50: Number(percentile(allSuccessLatencies, 0.5).toFixed(1)),
      p95: Number(percentile(allSuccessLatencies, 0.95).toFixed(1)),
      p99: Number(percentile(allSuccessLatencies, 0.99).toFixed(1)),
    },
    failedLatency: {
      avg: Number(average(allFailedLatencies).toFixed(1)),
      count: allFailedLatencies.length,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n==================== AGGREGATE RESULTS ====================");
  console.log(`Total Requests:      ${summary.totalRequests}`);
  console.log(`Successful:          ${summary.successfulRequests}/${summary.totalRequests} (${summary.successRate})`);
  console.log(`Failed:              ${summary.failedRequests}`);
  console.log(`Total Wall Time:     ${summary.totalWallSeconds}s`);
  console.log(`Throughput:          ${summary.throughputReqSec} req/s`);
  console.log(`Latency (Successful): Avg: ${summary.successLatency.avg}ms | P50: ${summary.successLatency.p50}ms | P95: ${summary.successLatency.p95}ms | P99: ${summary.successLatency.p99}ms`);
  if (summary.failedLatency.count > 0) {
    console.log(`Latency (Failed):     Avg: ${summary.failedLatency.avg}ms (Count: ${summary.failedLatency.count})`);
  }
  console.log("===========================================================\n");

  writeFileSync("benchmark-results.json", JSON.stringify(summary, null, 2));
  console.log("Saved benchmark report to benchmark-results.json");
}

if (require.main === module || process.argv[1]?.includes("bench-mark.ts")) {
  runBenchmark().catch((err) => {
    console.error("Benchmark crashed:", err);
    process.exit(1);
  });
}
