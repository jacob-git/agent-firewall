import { Intent } from "../core/intent.js";

export const ExecutionStatus = {
  SUCCESS: "SUCCESS",
  NOT_EXECUTED: "NOT_EXECUTED"
} as const;

export type ExecutionStatus = (typeof ExecutionStatus)[keyof typeof ExecutionStatus];

export interface ExecutionResult {
  status: ExecutionStatus;
  executed: boolean;
  detail: string;
  executedAt?: string;
}

export class Executor {
  execute(intent: Intent): ExecutionResult {
    return {
      status: ExecutionStatus.SUCCESS,
      executed: true,
      detail: `mock executor completed "${intent.action}"`,
      executedAt: new Date().toISOString()
    };
  }

  skip(detail: string): ExecutionResult {
    return {
      status: ExecutionStatus.NOT_EXECUTED,
      executed: false,
      detail
    };
  }
}
