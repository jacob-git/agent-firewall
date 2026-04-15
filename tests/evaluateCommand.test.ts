import test from "node:test";
import assert from "node:assert/strict";

import { evaluateCommand } from "../src/engine/evaluateCommand.js";
import { exitCodeForDecision } from "../src/cli/exitCodes.js";

test("blocks destructive commands", () => {
  const result = evaluateCommand("rm -rf /");

  assert.equal(result.decision, "BLOCKED");
  assert.equal(result.matchedRuleId, "block-rm-root");
});

test("approves harmless read-only commands", () => {
  const result = evaluateCommand("ls -la");

  assert.equal(result.decision, "APPROVED");
  assert.equal(result.risk, "low");
});

test("requires approval for risky commands", () => {
  const result = evaluateCommand("terraform apply");

  assert.equal(result.decision, "REQUIRES_APPROVAL");
  assert.equal(result.matchedRuleId, "require-terraform-apply");
});

test("normalization strips wrappers before rule matching", () => {
  const result = evaluateCommand("sudo env NODE_ENV=prod kubectl apply -f deploy.yaml");

  assert.equal(result.decision, "REQUIRES_APPROVAL");
  assert.equal(result.matchedRuleId, "require-kubectl-apply");
  assert.equal(result.normalizedCommand, "kubectl apply -f deploy.yaml");
});

test("read-only text containing deploy is not treated as a release command", () => {
  const result = evaluateCommand("echo deploy checklist");

  assert.equal(result.decision, "APPROVED");
  assert.equal(result.matchedRuleId, "approve-echo");
});

test("find delete is not approved as read-only diagnostics", () => {
  const result = evaluateCommand("find . -name '*.tmp' -delete");

  assert.equal(result.decision, "REQUIRES_APPROVAL");
  assert.equal(result.matchedRuleId, "default-review");
});

test("custom policy rules can override built-in behavior", () => {
  const result = evaluateCommand("kubectl apply -f deploy.yaml", {
    policyRules: [
      {
        id: "allow-kubectl-apply-in-ci",
        pattern: /^kubectl\s+apply\b/,
        decision: "APPROVED",
        reason: "approved in controlled ci context",
        risk: "medium",
      },
    ],
  });

  assert.equal(result.decision, "APPROVED");
  assert.equal(result.matchedRuleId, "allow-kubectl-apply-in-ci");
});

test("exit codes map cleanly to decisions", () => {
  assert.equal(exitCodeForDecision("APPROVED"), 0);
  assert.equal(exitCodeForDecision("REQUIRES_APPROVAL"), 10);
  assert.equal(exitCodeForDecision("BLOCKED"), 20);
});
