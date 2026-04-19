<<<<<<< HEAD
import { Queue as BullMQQueue, Worker as BullMQWorker } from "bullmq";
import { redis } from "./redis";

export const AI_JOB_QUEUE = "ai-generation";

export const aiQueue = new BullMQQueue(AI_JOB_QUEUE, {
  connection: redis,
=======
import { Queue, Worker } from "bullmq";
import { redisQueue } from "./redis";

export const AI_JOB_QUEUE = "ai-generation";

export const aiQueue = new Queue(AI_JOB_QUEUE, {
  connection: redisQueue,
>>>>>>> origin/main
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

export interface AIJobData {
  projectId: string;
  userId: string;
}

export interface AIJobResult {
  jobId: string;
  status: string;
  progress: number;
  result?: unknown;
  error?: string;
}
