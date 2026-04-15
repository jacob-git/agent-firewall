export type Decision = "APPROVED" | "REQUIRES_APPROVAL" | "BLOCKED";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface EvaluationRule {
  id: string;
  pattern: RegExp;
  decision: Decision;
  reason: string;
  risk: RiskLevel;
}

export interface PolicyRuleInput {
  id: string;
  pattern: string;
  decision: Decision;
  reason: string;
  risk: RiskLevel;
}

export interface EvaluationResult {
  command: string;
  normalizedCommand: string;
  decision: Decision;
  risk: RiskLevel;
  reason: string;
  matchedRuleId: string;
  timestamp: string;
}

export interface EngineOptions {
  policyRules?: EvaluationRule[];
}
