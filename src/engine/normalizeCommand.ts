function stripOuterQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function stripLeadingWrappers(value: string): string {
  let normalized = value;

  while (true) {
    const next = normalized
      .replace(/^(?:env\s+)?(?:[a-z_][a-z0-9_]*=(?:"[^"]*"|'[^']*'|[^\s]+)\s+)*/i, "")
      .replace(/^(?:sudo|command|nohup)\s+/i, "")
      .trim();

    if (next === normalized) {
      return normalized;
    }

    normalized = next;
  }
}

export function normalizeCommand(command: string): string {
  const normalized = stripLeadingWrappers(
    stripOuterQuotes(command)
      .trim()
      .replace(/\r?\n/g, " "),
  )
    .replace(/\s+/g, " ")
    .replace(/\s*([|;&><])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized.toLowerCase();
}
