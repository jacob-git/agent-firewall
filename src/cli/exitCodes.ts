import type { Decision } from "../types/index.js";

export const EXIT_CODE_APPROVED = 0;
export const EXIT_CODE_REQUIRES_APPROVAL = 10;
export const EXIT_CODE_BLOCKED = 20;
export const EXIT_CODE_USAGE_ERROR = 1;

export function exitCodeForDecision(decision: Decision): number {
  switch (decision) {
    case "APPROVED":
      return EXIT_CODE_APPROVED;
    case "REQUIRES_APPROVAL":
      return EXIT_CODE_REQUIRES_APPROVAL;
    case "BLOCKED":
      return EXIT_CODE_BLOCKED;
  }
}
