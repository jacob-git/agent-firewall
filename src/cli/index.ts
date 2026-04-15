#!/usr/bin/env node
import { spawn } from "node:child_process";

import { appendAuditLog, DEFAULT_LOG_PATH } from "../ledger/auditLog.js";
import { loadPolicyFile } from "../policy/loadPolicyFile.js";
import { evaluateCommand } from "../engine/evaluateCommand.js";
import { renderHumanResult } from "./renderResult.js";
import {
  exitCodeForDecision,
  EXIT_CODE_USAGE_ERROR,
} from "./exitCodes.js";
import type { EvaluationResult } from "../types/index.js";

interface ParsedArgs {
  commandName?: string;
  command?: string;
  json: boolean;
  policyPath?: string;
  logPath?: string;
  quiet: boolean;
}

function printUsage(): void {
  console.error(`Usage:
  agent-firewall check "<command>" [--json] [--policy ./policy.json] [--log-path ./audit.jsonl]
  agent-firewall exec "<command>" [--policy ./policy.json] [--log-path ./audit.jsonl] [--quiet]

Examples:
  agent-firewall check "ls -la"
  agent-firewall check "rm -rf /tmp/*"
  agent-firewall exec "ls -la"
  agent-firewall check --policy ./policy.json "kubectl apply -f deploy.yaml"`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = { json: false, quiet: false };
  const positionals: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--json") {
      parsed.json = true;
      continue;
    }

    if (arg === "--policy") {
      parsed.policyPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--log-path") {
      parsed.logPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--quiet") {
      parsed.quiet = true;
      continue;
    }

    positionals.push(arg);
  }

  parsed.commandName = positionals[0];
  parsed.command = positionals.slice(1).join(" ").trim();
  return parsed;
}

function printResult(parsed: ParsedArgs, output: EvaluationResult, logPath: string): void {
  if (parsed.quiet) {
    return;
  }

  if (parsed.json) {
    process.stdout.write(`${JSON.stringify({ ...output, auditLog: logPath }, null, 2)}\n`);
    return;
  }

  process.stdout.write(`${renderHumanResult(output, logPath)}\n`);
}

async function executeApprovedCommand(command: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        resolve(1);
        return;
      }

      resolve(code ?? 0);
    });
  });
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));

  if (!["check", "exec"].includes(parsed.commandName ?? "") || !parsed.command) {
    printUsage();
    process.exitCode = EXIT_CODE_USAGE_ERROR;
    return;
  }

  const policyRules = parsed.policyPath ? await loadPolicyFile(parsed.policyPath) : [];
  const result = evaluateCommand(parsed.command, { policyRules });
  const logPath = await appendAuditLog(result, parsed.logPath ?? DEFAULT_LOG_PATH);

  if (parsed.commandName === "check") {
    printResult(parsed, result, logPath);
    process.exitCode = exitCodeForDecision(result.decision);
    return;
  }

  if (result.decision !== "APPROVED") {
    printResult(parsed, result, logPath);
    process.exitCode = exitCodeForDecision(result.decision);
    return;
  }

  printResult(parsed, result, logPath);
  process.exitCode = await executeApprovedCommand(parsed.command);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`agent-firewall error: ${message}`);
  process.exitCode = EXIT_CODE_USAGE_ERROR;
});
