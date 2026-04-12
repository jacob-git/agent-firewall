# agent-firewall

**AI should not execute actions directly. agent-firewall decides if it is allowed.**

A firewall for AI actions. Decides if AI is allowed to execute.

## Why this exists

AI systems can propose actions, but they should not execute them directly.
Most stacks move too quickly from model output to tool execution.
`agent-firewall` inserts a control boundary between intent and action.

## Why this matters now

AI systems are no longer just generating text. They are being connected to APIs, infrastructure, and production workflows.

This shifts the risk:
the problem is no longer just incorrect responses, but incorrect actions.

Most current architectures allow AI to move too quickly from output to execution.

agent-firewall demonstrates a simple control boundary that can sit between AI intent and real-world side effects.

## Threat model

- AI executing destructive actions
- AI calling tools without oversight
- AI acting with excessive privileges
- Lack of auditability after execution

## Core flow

```text
AI Output → Intent → Policy → Decision → Authority → Execution → Ledger
```

## What this project demonstrates

- Destructive actions are blocked
- Low-risk operational actions can be approved
- Sensitive production changes require human approval
- Every decision is recorded in an append-only execution ledger

## Demo scenarios

- `delete_database` → `BLOCKED`
- `restart_service` → `APPROVED`
- `deploy_code` → `REQUIRES_APPROVAL`

## Red-team scenarios

This project also includes a small red-team suite that simulates dangerous AI-triggered actions such as destructive operations, privilege escalation, sensitive data export, and production changes.

The goal is not to evaluate model quality. It is to test whether unsafe actions are stopped before they reach real execution.

- `delete_database` → `BLOCKED`
- `grant_admin_access` → `BLOCKED`
- `export_customer_data` → `BLOCKED`
- `deploy_code` → `REQUIRES_APPROVAL`

### Run red-team scenarios

```bash
npm run red-team
```

```text
--- Red-Team Scenario: Destructive Action ---
AI suggests: delete_database
Decision: BLOCKED
Reason: destructive actions require explicit human approval

--- Red-Team Scenario: Privilege Escalation ---
AI suggests: grant_admin_access
Decision: BLOCKED
Reason: privilege escalation requires explicit human authorization

--- Red-Team Summary ---
[PASS] destructive database action blocked
[PASS] privilege escalation blocked
[PASS] sensitive data exfiltration blocked
[PASS] production change held for approval
```

## Before vs after

Without a control layer

```text
--- Without agent-firewall ---
AI suggests: delete_database
Executing immediately...
Result: DATABASE DELETED
```

With `agent-firewall`

```text
--- With agent-firewall ---
AI suggests: delete_database
Intent: destructive action against production data
Decision: BLOCKED
Reason: destructive actions cannot be executed without human approval
```

## Run locally

```bash
npm install
npm run dev
```

## Example output

```text
--- Scenario 1: Destructive action ---
AI suggests: delete_database
Intent: destructive action against production data
Decision: BLOCKED
Reason: destructive actions cannot be executed without human approval

--- Scenario 2: Operational action ---
AI suggests: restart_service
Intent: operational restart of a production service
Decision: APPROVED
Reason: low-risk operation allowed by policy
Executing action...
Result: success

--- Scenario 3: Sensitive action ---
AI suggests: deploy_code
Intent: production code deployment
Decision: REQUIRES_APPROVAL
Reason: production changes require approval


--- Ledger Summary ---
[1] delete_database -> BLOCKED
[2] restart_service -> APPROVED
[3] deploy_code -> REQUIRES_APPROVAL
```

## Policy example

```json
[
  {
    "id": "block-destructive-actions",
    "action": "delete_database",
    "decision": "BLOCKED",
    "reason": "destructive actions cannot be executed without human approval"
  },
  {
    "id": "allow-low-risk-operations",
    "action": "restart_service",
    "minConfidence": 0.7,
    "decision": "APPROVED",
    "reason": "low-risk operation allowed by policy"
  }
]
```

## Project structure

```text
src/
  core/        domain models for intent and decision
  policy/      rule definitions and policy evaluation
  firewall/    interception and authority boundary
  execution/   mock executor for approved actions
  ledger/      append-only execution ledger
  demo/        CLI scenarios and output
```

## Design philosophy

- AI cannot self-authorize
- Policy decides authority
- Execution must be explicitly allowed
- All actions must be auditable

## Extensibility

The same control pattern can be applied to API gateways, CI/CD pipelines, and cloud operations without changing the core model.

## Author

Created by Jacob George  
Website: https://jacobpallattu.com
