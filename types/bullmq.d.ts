declare module "bullmq" {
  import { RedisClientType } from "ioredis";

  export interface JobOptions {
    priority?: number;
    attempts?: number;
    backoff?: { type: string; delay?: number };
    timeout?: number;
    jobId?: string;
    removeOnComplete?: number | boolean;
    removeOnFail?: number | boolean;
  }

  export interface QueueOptions {
    connection?: RedisClientType;
    defaultJobOptions?: JobOptions;
  }

  export interface JobData {
    [key: string]: unknown;
  }

  export class Job<T = JobData, R = unknown> {
    id: string | null;
    name: string;
    data: T;
    progress: number | Record<string, unknown>;
    attemptsMade: number;
    constructor(queue: Queue<T>, name: string, data?: T, opts?: JobOptions);
    updateProgress(progress: number | Record<string, unknown>): Promise<void>;
    remove(): Promise<void>;
  }

  export class Queue<T = JobData> {
    constructor(name: string, opts?: QueueOptions);
    add(name: string, data: T, opts?: JobOptions): Promise<Job<T, unknown>>;
    getJobs(types: string[]): Promise<Job<T, unknown>[]>;
  }

  export class Worker<T = JobData, R = unknown> {
    constructor(
      name: string,
      processor?: (job: Job<T, R>) => Promise<R>,
      opts?: {
        connection?: RedisClientType;
        concurrency?: number;
      }
    );
    on(event: "completed" | "failed", handler: (job: Job<T, R> | undefined, err?: Error) => void): this;
    on(event: string, handler: (...args: unknown[]) => void): this;
  }
}
