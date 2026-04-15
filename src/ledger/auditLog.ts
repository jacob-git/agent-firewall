import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { EvaluationResult } from "../types/index.js";

export const DEFAULT_LOG_PATH = ".agent-firewall/audit.jsonl";

export async function appendAuditLog(result: EvaluationResult, logPath = DEFAULT_LOG_PATH): Promise<string> {
  const absolutePath = resolve(logPath);
  await mkdir(dirname(absolutePath), { recursive: true });

  const line = JSON.stringify({
    timestamp: result.timestamp,
    command: result.command,
    normalizedCommand: result.normalizedCommand,
    decision: result.decision,
    reason: result.reason,
    risk: result.risk,
    ruleId: result.matchedRuleId,
  });

  await appendFile(absolutePath, `${line}\n`, "utf8");
  return absolutePath;
}
