
const TOTAL_REQUESTS = 40;
const CONCURRENT_WORKERS = 5;
const WARMUP_REQUESTS = 5;
const ROUNDS = 5;

const API_URL = "http://localhost:5000/api/execute";

const pythonPayload = {
  language: "python",
  code: `
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([38, 27, 43, 3, 9, 82, 10]))
`,
};

type BenchmarkResult = {
  successCount: number;
  failureCount: number;
  latencies: number[];
  totalSeconds: number;
};

function percentile(values: number[], p: number): number {
  if (values.length === 0) {
    return NaN;
  }

  const index = (values.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return values[lower];
  }

  return (
    values[lower] +
    (values[upper] - values[lower]) * (index - lower)
  );
}

function average(values: number[]): number {
  if (values.length === 0) {
    return NaN;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function executeRequest(): Promise<{
  success: boolean;
  latency: number;
}> {
  const t0 = performance.now();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pythonPayload),
    });

    const data = await response.json();
    const latency = performance.now() - t0;

    return {
      success: response.ok && data.status === 200,
      latency,
    };
  } catch {
    return {
      success: false,
      latency: performance.now() - t0,
    };
  }
}

async function runRequests(totalRequests: number): Promise<BenchmarkResult> {
  const latencies: number[] = [];
  let successCount = 0;
  let failureCount = 0;

  const jobQueue = Array.from({ length: totalRequests }, (_, i) => i);
  const wallClockStart = performance.now();

  async function worker() {
    while (jobQueue.length > 0) {
      jobQueue.pop();

      const result = await executeRequest();

      if (result.success) {
        successCount++;
        latencies.push(result.latency);
      } else {
        failureCount++;
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(CONCURRENT_WORKERS, totalRequests) },
      () => worker(),
    ),
  );

  const totalSeconds = (performance.now() - wallClockStart) / 1000;

  return {
    successCount,
    failureCount,
    latencies,
    totalSeconds,
  };
}

async function warmup() {
  console.log(`Running ${WARMUP_REQUESTS} warmup requests...`);

  const result = await runRequests(WARMUP_REQUESTS);

  console.log(
    `Warmup: ${result.successCount}/${WARMUP_REQUESTS} succeeded\n`,
  );
}

function printResults(
  results: BenchmarkResult[],
  totalRequests: number,
) {
  const allLatencies = results
    .flatMap((result) => result.latencies)
    .sort((a, b) => a - b);

  const totalSuccesses = results.reduce(
    (sum, result) => sum + result.successCount,
    0,
  );

  const totalFailures = results.reduce(
    (sum, result) => sum + result.failureCount,
    0,
  );

  const totalWallTime = results.reduce(
    (sum, result) => sum + result.totalSeconds,
    0,
  );

  const totalExecutions = totalRequests * ROUNDS;

  const avg = average(allLatencies);
  const p50 = percentile(allLatencies, 0.50);
  const p95 = percentile(allLatencies, 0.95);
  const p99 = percentile(allLatencies, 0.99);

  // Aggregate throughput across all benchmark rounds.
  const throughput = totalSuccesses / totalWallTime;

  console.log("\n==================== BENCHMARK RESULTS ====================");

  console.log(
    `Total Requests:   ${totalExecutions}`,
  );

  console.log(
    `Successful:       ${totalSuccesses}/${totalExecutions}`,
  );

  console.log(
    `Failed:            ${totalFailures}`,
  );

  console.log(
    `Concurrency:       ${CONCURRENT_WORKERS}`,
  );

  console.log(
    `Rounds:            ${ROUNDS}`,
  );

  console.log(
    `Total Wall Time:   ${totalWallTime.toFixed(2)} seconds`,
  );

  console.log(
    `Throughput:        ${throughput.toFixed(1)} requests/second`,
  );

  console.log(
    `Average Latency:   ${avg.toFixed(1)} ms`,
  );

  console.log(
    `P50 Latency:       ${p50.toFixed(1)} ms`,
  );

  console.log(
    `P95 Latency:       ${p95.toFixed(1)} ms`,
  );

  console.log(
    `P99 Latency:       ${p99.toFixed(1)} ms`,
  );

  console.log("===========================================================\n");

  console.log("Per-round results:");

  results.forEach((result, index) => {
    const roundLatencies = [...result.latencies].sort(
      (a, b) => a - b,
    );

    const roundAvg = average(roundLatencies);
    const roundP95 = percentile(roundLatencies, 0.95);
    const roundRps =
      result.successCount / result.totalSeconds;

    console.log(
      `Round ${index + 1}: ` +
        `${result.successCount}/${TOTAL_REQUESTS} succeeded | ` +
        `${roundRps.toFixed(1)} req/s | ` +
        `avg ${roundAvg.toFixed(1)} ms | ` +
        `p95 ${roundP95.toFixed(1)} ms`,
    );
  });

  console.log();
}

async function executeBenchmark() {
  console.log("\nStarting VisualizeX Benchmark:");
  console.log(`- Requests per round: ${TOTAL_REQUESTS}`);
  console.log(`- Benchmark rounds:    ${ROUNDS}`);
  console.log(`- Warmup requests:     ${WARMUP_REQUESTS}`);
  console.log(`- Concurrency limit:   ${CONCURRENT_WORKERS}`);
  console.log(`- Isolation:           Docker`);
  console.log(`- Memory limit:        128 MB`);
  console.log(`- CPU limit:           0.5 CPU`);
  console.log(`- Network:             Disabled\n`);

  // Warm up the API/Docker execution path before measuring.
  await warmup();

  const results: BenchmarkResult[] = [];

  for (let round = 1; round <= ROUNDS; round++) {
    console.log(
      `Running benchmark round ${round}/${ROUNDS}...`,
    );

    const result = await runRequests(TOTAL_REQUESTS);

    results.push(result);

    console.log(
      `  ${result.successCount}/${TOTAL_REQUESTS} succeeded | ` +
        `${result.totalSeconds.toFixed(2)}s`,
    );
  }

  printResults(results, TOTAL_REQUESTS);
}

executeBenchmark().catch((error) => {
  console.error("\nBenchmark crashed:");
  console.error(error);
  process.exit(1);
});
// ```

// 

// ```bash
// bun run bench-mark.ts
// ```

// This will now test **205 executions total**: 5 warmup requests + 5 × 40 measured requests. The reported aggregate latency/throughput excludes the warmup.
