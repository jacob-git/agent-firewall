import type { EvaluationResult } from "../types/index.js";

export function renderHumanResult(result: EvaluationResult, logPath: string): string {
  return [
    `agent-firewall: ${result.decision} (${result.risk})`,
    `reason: ${result.reason}`,
    `rule:   ${result.matchedRuleId}`,
    "",
    `command:    ${result.command}`,
    `normalized: ${result.normalizedCommand}`,
    `timestamp:  ${result.timestamp}`,
    `audit log:  ${logPath}`,
  ].join("\n");
}
