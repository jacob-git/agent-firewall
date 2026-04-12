import { DecisionType } from "../core/decision.js";
import { ActionName } from "../core/intent.js";

export interface PolicyRule {
  id: string;
  action: ActionName | "*";
  minConfidence?: number;
  decision: DecisionType;
  reason: string;
}
