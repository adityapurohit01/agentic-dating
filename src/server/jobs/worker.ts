import pLimit from "p-limit";
import { dequeueNextJob, completeJob, failJob, resetStalledJobs } from "./queue";
import { handleCollect, handleRead } from "./handlers";
import { executeDate } from "../dating/run-date";

declare global {
  var _workerRunning: boolean | undefined;
}

export function startWorker() {
  if (global._workerRunning) return;
  global._workerRunning = true;

  resetStalledJobs();

  const concurrency = Number(process.env.CONCURRENCY || 12);
  const limit = pLimit(concurrency);

  async function pollLoop() {
    while (global._workerRunning) {
      try {
        const job = dequeueNextJob();
        if (!job) {
          await new Promise((res) => setTimeout(res, 1000));
          continue;
        }

        limit(async () => {
          try {
            if (job.type === "collect") {
              await handleCollect(job.payload.personId);
            } else if (job.type === "read") {
              await handleRead(job.payload.personId);
            } else if (job.type === "date") {
              await executeDate(job.payload.dateId);
            }
            completeJob(job.id);
          } catch (err: any) {
            failJob(job.id, err.message || "Unknown job failure");
          }
        });
      } catch {
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }

  pollLoop();
}

export function stopWorker() {
  global._workerRunning = false;
}
