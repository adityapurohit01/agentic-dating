export async function register() {
  const isBuild =
    process.argv.some((arg) => arg.includes("build")) ||
    process.env.npm_lifecycle_event === "build";

  if (process.env.NEXT_RUNTIME === "nodejs" && !isBuild) {
    const { startWorker } = await import("./server/jobs/worker");
    startWorker();
  }
}
