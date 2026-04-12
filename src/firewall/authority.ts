import { Decision, DecisionType } from "../core/decision.js";
import { Intent } from "../core/intent.js";
import { Executor, ExecutionResult } from "../execution/executor.js";
import { ExecutionLedger, LedgerEntry } from "../ledger/ledger.js";
import { PolicyEngine } from "../policy/policyEngine.js";

export interface AuthorityResult {
  decision: Decision;
  execution: ExecutionResult;
  ledgerEntry: LedgerEntry;
}

export class Authority {
  constructor(
    private readonly policyEngine: PolicyEngine,
    private readonly executor: Executor,
    private readonly executionLedger: ExecutionLedger
  ) {}

  handle(intent: Intent): AuthorityResult {
    const decision = this.policyEngine.evaluate(intent);
    const execution =
      decision.type === DecisionType.APPROVED
        ? this.executor.execute(intent)
        : this.executor.skip(
            decision.type === DecisionType.BLOCKED
              ? "execution blocked by policy decision"
              : "execution deferred pending human approval"
          );

    const ledgerEntry = this.executionLedger.append({
      timestamp: new Date().toISOString(),
      intent,
      decision,
      execution
    });

    return { decision, execution, ledgerEntry };
  }
}
