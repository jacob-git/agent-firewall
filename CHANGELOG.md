# Changelog

## 0.1.0

Initial public release.

Highlights:

- installable npm package with CLI and library entrypoints
- `agent-firewall check "<command>"` for command evaluation
- `agent-firewall exec "<command>"` for approved command execution
- built-in rules for destructive, risky, and read-only command patterns
- optional regex-based policy file support
- local JSONL audit logging
- human-readable and JSON output modes
- decision-based exit codes for wrapper and automation use
- test coverage for core evaluation behavior
