import { Decision, DecisionType } from "../core/decision.js";
import { Intent } from "../core/intent.js";
import policies from "./policies.json";
import { PolicyRule } from "./policyRule.js";

export class PolicyEngine {
  private readonly rules: PolicyRule[];

  constructor(rules: PolicyRule[] = policies as PolicyRule[]) {
    this.rules = rules;
  }

  evaluate(intent: Intent): Decision {
    // Ordered rules make the engine deterministic and easy to reason about.
    for (const rule of this.rules) {
      if (!this.matchesAction(rule, intent)) {
        continue;
      }

      if (!this.meetsConfidence(rule, intent)) {
        continue;
      }

      return {
        type: rule.decision,
        reason: rule.reason,
        matchedRuleId: rule.id
      };
    }

    return {
      type: DecisionType.REQUIRES_APPROVAL,
      reason: "no policy rule explicitly allows this action",
      matchedRuleId: "default-deny"
    };
  }

  private matchesAction(rule: PolicyRule, intent: Intent): boolean {
    return rule.action === "*" || rule.action === intent.action;
  }

  private meetsConfidence(rule: PolicyRule, intent: Intent): boolean {
    return rule.minConfidence === undefined || intent.confidence >= rule.minConfidence;
  }
}
