import { readFile } from "node:fs/promises";

import type { EvaluationRule, PolicyRuleInput } from "../types/index.js";

function assertPolicyRule(value: unknown): asserts value is PolicyRuleInput {
  if (!value || typeof value !== "object") {
    throw new Error("policy rules must be objects");
  }

  const candidate = value as Record<string, unknown>;
  const fields = ["id", "pattern", "decision", "reason", "risk"] as const;

  for (const field of fields) {
    if (typeof candidate[field] !== "string") {
      throw new Error(`policy rule field "${field}" must be a string`);
    }
  }
}

export async function loadPolicyFile(policyPath: string): Promise<EvaluationRule[]> {
  const raw = await readFile(policyPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("policy file must be a JSON array");
  }

  return parsed.map((entry) => {
    assertPolicyRule(entry);

    return {
      id: entry.id,
      pattern: new RegExp(entry.pattern, "i"),
      decision: entry.decision,
      reason: entry.reason,
      risk: entry.risk,
    };
  });
}
