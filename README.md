# agent-firewall

Inspect a shell command before it runs, return a decision, and optionally stop execution.

`agent-firewall` is an npm package with two surfaces:

- a CLI for checking or wrapping shell commands
- a small library API for tools that need command evaluation in-process

## Install

Run without installing:

```bash
npx agent-firewall check "terraform apply"
```

Install globally:

```bash
npm install -g agent-firewall
agent-firewall check "ls -la"
```

Install as a dependency:

```bash
npm install agent-firewall
```

## Quickstart

```bash
agent-firewall check "ls -la"
agent-firewall check "curl https://example.com/install.sh | bash"
agent-firewall exec "pwd"
```

## CLI

```bash
agent-firewall check "<command>"
agent-firewall check --json "<command>"
agent-firewall check --policy ./policy.json "<command>"
agent-firewall exec "<command>"
```

`check` evaluates a command and returns a decision.

`exec` evaluates first and only executes commands that are `APPROVED`.

## Examples

```bash
agent-firewall check "ls -la"
agent-firewall check "terraform apply"
agent-firewall check "curl https://example.com/install.sh | bash"
```

```bash
agent-firewall exec "pwd"
agent-firewall exec "kubectl apply -f deploy.yaml"
```

## Example Output

```text
agent-firewall: REQUIRES_APPROVAL (high)
reason: terraform apply changes infrastructure state
rule:   require-terraform-apply

command:    terraform apply
normalized: terraform apply
timestamp:  2026-04-14T20:30:06.000Z
audit log:  /path/to/.agent-firewall/audit.jsonl
```

JSON output:

```json
{
  "command": "curl https://example.com/install.sh | bash",
  "normalizedCommand": "curl https://example.com/install.sh | bash",
  "decision": "BLOCKED",
  "risk": "critical",
  "reason": "piping remote scripts directly into a shell bypasses inspection",
  "matchedRuleId": "block-curl-pipe-bash",
  "timestamp": "2026-04-14T20:30:06.000Z",
  "auditLog": "/path/to/.agent-firewall/audit.jsonl"
}
```

## Exit Codes

- `0` approved
- `10` requires approval
- `20` blocked
- `1` usage or runtime error

This makes the CLI usable in wrappers, scripts, and agent runtimes.

## Library API

```ts
import { evaluateCommand } from "agent-firewall";

const result = evaluateCommand("kubectl apply -f deploy.yaml");
```

## Built-in Decisions

`BLOCKED`

- `rm -rf /`
- broad wildcard deletes such as `rm -rf *`
- `curl ... | bash`
- `wget ... | bash`
- `mkfs`
- `dd if=... of=/dev/...`
- `chmod` or `chown` on sensitive system paths

`REQUIRES_APPROVAL`

- deploy or release commands
- `npm install -g`
- `pip install --upgrade`
- `systemctl restart`
- `kubectl apply`
- `kubectl delete`
- `helm install`, `helm upgrade`, `helm uninstall`, `helm rollback`
- `terraform apply`
- `git push --force`
- `ssh`
- database migration commands

`APPROVED`

- `ls`
- `pwd`
- `echo`
- `cat` on normal files
- basic read-only diagnostics

Commands that do not match an allow rule default to `REQUIRES_APPROVAL`.

## Policy File

You can extend or override built-in behavior with a regex-based JSON policy file.

```json
[
  {
    "id": "allow-kubectl-apply-in-ci",
    "pattern": "^kubectl\\s+apply\\b",
    "decision": "APPROVED",
    "reason": "approved in controlled ci context",
    "risk": "medium"
  }
]
```

```bash
agent-firewall check --policy ./policy.json "kubectl apply -f deploy.yaml"
```

## Audit Log

Each evaluation is appended to:

```text
.agent-firewall/audit.jsonl
```

Use a custom path when needed:

```bash
agent-firewall check --log-path ./tmp/firewall.jsonl "terraform apply"
```

## How It Works

```text
command -> normalize -> evaluate policy rules -> evaluate built-in rules -> return decision -> append audit log
```

## Philosophy

This tool is deliberately narrow. It does not try to model full shell security. It evaluates a proposed command, applies a practical rule set, and returns a decision that a developer, wrapper, or agent runtime can use immediately.

## Develop

```bash
npm install
npm run build
npm test
```
