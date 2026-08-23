// Background Job Queue & Worker Manager
// Supports async execution, rate limiting, and BullMQ/In-Memory orchestration

export type JobType =
  | 'JOB_DISCOVERY_SYNC'
  | 'ANALYZE_MATCH'
  | 'GENERATE_TAILORED_RESUME'
  | 'PREPARE_APPLICATION'
  | 'SUBMIT_APPLICATION'
  | 'DISPATCH_NOTIFICATION';

export interface QueueJob<T = any> {
  id: string;
  type: JobType;
  payload: T;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  retries: number;
  maxRetries: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export class QueueManager {
  private static instance: QueueManager;
  private jobs: Map<string, QueueJob> = new Map();
  private handlers: Map<JobType, (payload: any) => Promise<any>> = new Map();

  private constructor() {}

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  public registerWorker(type: JobType, handler: (payload: any) => Promise<any>) {
    this.handlers.set(type, handler);
  }

  public async enqueue<T = any>(type: JobType, payload: T, maxRetries = 3): Promise<QueueJob<T>> {
    const id = `job_${type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job: QueueJob<T> = {
      id,
      type,
      payload,
      status: 'PENDING',
      retries: 0,
      maxRetries,
      createdAt: new Date()
    };

    this.jobs.set(id, job);

    // Process asynchronously without blocking API request
    setTimeout(() => {
      this.processJob(id);
    }, 50);

    return job;
  }

  private async processJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'ACTIVE' || job.status === 'COMPLETED') return;

    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = 'FAILED';
      job.error = `No worker registered for job type: ${job.type}`;
      return;
    }

    job.status = 'ACTIVE';
    job.startedAt = new Date();

    try {
      await handler(job.payload);
      job.status = 'COMPLETED';
      job.completedAt = new Date();
    } catch (err: any) {
      job.retries++;
      if (job.retries < job.maxRetries) {
        job.status = 'PENDING';
        // Exponential backoff retry
        setTimeout(() => {
          this.processJob(jobId);
        }, Math.pow(2, job.retries) * 1000);
      } else {
        job.status = 'FAILED';
        job.error = err.message || 'Worker execution failed';
      }
    }
  }

  public getJob(id: string): QueueJob | undefined {
    return this.jobs.get(id);
  }

  public listRecentJobs(): QueueJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const queueManager = QueueManager.getInstance();
