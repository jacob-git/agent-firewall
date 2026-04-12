# agent-firewall

**AI should not execute actions directly. agent-firewall decides if it is allowed.**

A firewall for AI actions. Decides if AI is allowed to execute.

## Why this exists

AI systems can propose actions, but they should not execute them directly.
Most stacks move too quickly from model output to tool execution.
`agent-firewall` inserts a control boundary between intent and action.

## Why this matters now

AI agents are becoming more autonomous.
Systems are increasingly connecting AI directly to APIs and production systems.
What is still missing in many stacks is runtime control.

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

The repository includes adversarial scenarios that test whether unsafe AI actions
are blocked or contained before execution through the same policy and authority path.

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
