import { builtInRules } from "../rules/builtInRules.js";
import type { EngineOptions, EvaluationResult, EvaluationRule } from "../types/index.js";
import { normalizeCommand } from "./normalizeCommand.js";

const defaultResult = (command: string, normalizedCommand: string): EvaluationResult => ({
  command,
  normalizedCommand,
  decision: "REQUIRES_APPROVAL",
  risk: "medium",
  reason: "no built-in or custom rule approved this command",
  matchedRuleId: "default-review",
  timestamp: new Date().toISOString(),
});

function selectRules(options?: EngineOptions): EvaluationRule[] {
  return [...(options?.policyRules ?? []), ...builtInRules];
}

export function evaluateCommand(command: string, options?: EngineOptions): EvaluationResult {
  const normalizedCommand = normalizeCommand(command);
  const rules = selectRules(options);

  for (const rule of rules) {
    if (!rule.pattern.test(normalizedCommand)) {
      continue;
    }

    return {
      command,
      normalizedCommand,
      decision: rule.decision,
      risk: rule.risk,
      reason: rule.reason,
      matchedRuleId: rule.id,
      timestamp: new Date().toISOString(),
    };
  }

  return defaultResult(command, normalizedCommand);
}
