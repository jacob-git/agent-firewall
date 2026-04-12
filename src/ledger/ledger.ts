import { Decision } from "../core/decision.js";
import { Intent } from "../core/intent.js";
import { ExecutionResult } from "../execution/executor.js";

export interface ExecutionLedgerRecord {
  intent: Intent;
  decision: Decision;
  execution: ExecutionResult;
  timestamp: string;
}

export interface LedgerEntry extends ExecutionLedgerRecord {
  sequence: number;
}

export function formatExecutionLedgerSummary(entries: LedgerEntry[]): string {
  const lines = entries.map((entry) => {
    return `[${entry.sequence}] ${entry.intent.action} -> ${entry.decision.type}`;
  });

  return ["--- Ledger Summary ---", ...lines].join("\n");
}

export class ExecutionLedger {
  private readonly entries: LedgerEntry[] = [];

  append(record: ExecutionLedgerRecord): LedgerEntry {
    const entry: LedgerEntry = {
      sequence: this.entries.length + 1,
      ...record
    };

    this.entries.push(entry);
    return entry;
  }

  all(): LedgerEntry[] {
    return [...this.entries];
  }
}
