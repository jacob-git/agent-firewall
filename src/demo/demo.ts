import { RawAction } from "../core/intent.js";
import { DecisionType } from "../core/decision.js";
import { Executor } from "../execution/executor.js";
import { Authority } from "../firewall/authority.js";
import { Interceptor } from "../firewall/interceptor.js";
import { ExecutionLedger, formatExecutionLedgerSummary } from "../ledger/ledger.js";
import { PolicyEngine } from "../policy/policyEngine.js";

interface DemoScenario {
  title: string;
  action: RawAction;
}

function printBeforeFirewall(action: RawAction): void {
  console.log("--- Without agent-firewall ---");
  console.log(`AI suggests: ${action.action}`);
  console.log("Executing immediately...");
  console.log("Result: DATABASE DELETED");
  console.log("");
}

function printWithFirewallHeader(action: RawAction): void {
  console.log("--- With agent-firewall ---");
  console.log(`AI suggests: ${action.action}`);
}

function printScenario(index: number, scenario: DemoScenario, authority: Authority, interceptor: Interceptor): void {
  const { action } = scenario;
  const intent = interceptor.toIntent(action);
  const result = authority.handle(intent);

  console.log(`--- Scenario ${index}: ${scenario.title} ---`);
  console.log(`AI suggests: ${action.action}`);
  console.log(`Intent: ${intent.summary}`);
  console.log(`Decision: ${result.decision.type}`);
  console.log(`Reason: ${result.decision.reason}`);

  if (result.decision.type === DecisionType.APPROVED) {
    console.log("Executing action...");
    console.log(`Result: ${result.execution.executed ? "success" : "not executed"}`);
  }

  if (result.decision.type === DecisionType.REQUIRES_APPROVAL) {
    console.log("Execution pending approval.");
  }

  console.log("");
}

export function runDemo(): void {
  const interceptor = new Interceptor();
  const executionLedger = new ExecutionLedger();
  const authority = new Authority(new PolicyEngine(), new Executor(), executionLedger);

  const scenarios: DemoScenario[] = [
    {
      title: "Destructive action",
      action: { action: "delete_database", confidence: 0.95 }
    },
    {
      title: "Operational action",
      action: { action: "restart_service", confidence: 0.92 }
    },
    {
      title: "Sensitive action",
      action: { action: "deploy_code", confidence: 0.88 }
    }
  ];

  const destructiveAction = scenarios[0]?.action;
  if (destructiveAction) {
    printBeforeFirewall(destructiveAction);
    printWithFirewallHeader(destructiveAction);
    const destructiveIntent = interceptor.toIntent(destructiveAction);
    const destructiveResult = authority.handle(destructiveIntent);
    console.log(`Intent: ${destructiveIntent.summary}`);
    console.log(`Decision: ${destructiveResult.decision.type}`);
    console.log(`Reason: ${destructiveResult.decision.reason}`);
    console.log("");
  }

  scenarios.forEach((scenario, index) => {
    if (index === 0) {
      return;
    }
    printScenario(index + 1, scenario, authority, interceptor);
  });

  console.log(formatExecutionLedgerSummary(executionLedger.all()));
  console.log("");
  console.log("--- Execution Ledger ---");
  console.log(JSON.stringify(executionLedger.all(), null, 2));
}
