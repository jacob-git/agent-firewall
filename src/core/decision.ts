export const DecisionType = {
  BLOCKED: "BLOCKED",
  APPROVED: "APPROVED",
  REQUIRES_APPROVAL: "REQUIRES_APPROVAL"
} as const;

export type DecisionType = (typeof DecisionType)[keyof typeof DecisionType];

export interface Decision {
  type: DecisionType;
  reason: string;
  matchedRuleId: string;
}
