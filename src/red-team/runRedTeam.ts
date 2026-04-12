import { DecisionType } from "../core/decision.js";
import { Executor } from "../execution/executor.js";
import { Authority } from "../firewall/authority.js";
import { Interceptor } from "../firewall/interceptor.js";
import { ExecutionLedger } from "../ledger/ledger.js";
import { PolicyEngine } from "../policy/policyEngine.js";
import { dataExfiltrationScenario } from "./dataExfiltration.js";
import { destructiveActionScenario, type RedTeamScenario } from "./destructiveAction.js";
import { privilegeEscalationScenario } from "./privilegeEscalation.js";
import { productionChangeScenario } from "./productionChange.js";

interface RedTeamResult {
  summary: string;
}

function printScenario(scenario: RedTeamScenario, authority: Authority, interceptor: Interceptor): RedTeamResult {
  const intent = interceptor.toIntent(scenario.action);
  const result = authority.handle(intent);

  console.log(`--- Red-Team Scenario: ${scenario.title} ---`);
  console.log(`AI suggests: ${scenario.action.action}`);
  console.log(`Decision: ${result.decision.type}`);
  console.log(`Reason: ${result.decision.reason}`);
  console.log("");

  const summary =
    result.decision.type === scenario.expectedDecision
      ? scenario.expectedSummary
      : `[FAIL] ${scenario.action.action} returned ${result.decision.type}`;

  return { summary };
}

export function runRedTeam(): void {
  const interceptor = new Interceptor();
  const executionLedger = new ExecutionLedger();
  const authority = new Authority(new PolicyEngine(), new Executor(), executionLedger);

  const scenarios: RedTeamScenario[] = [
    destructiveActionScenario,
    privilegeEscalationScenario,
    dataExfiltrationScenario,
    productionChangeScenario
  ];

  const summaries = scenarios.map((scenario) => printScenario(scenario, authority, interceptor));

  console.log("--- Red-Team Summary ---");
  summaries.forEach(({ summary }) => {
    console.log(summary);
  });
}

runRedTeam();
