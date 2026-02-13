export function toTypstValue(v: unknown): string {
  if (v === null || v === undefined) return "none";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "none";
  if (typeof v === "boolean") return v ? "true" : "false";

  if (typeof v === "string") {
    const s = v.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `"${s}"`;
  }

  if (Array.isArray(v)) {
    return `(${v.map(toTypstValue).join(", ")})`;
  }

  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    const entries = Object.entries(obj).map(([k, val]) => {
      const kk = k.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `"${kk}": ${toTypstValue(val)}`;
    });
    return `(${entries.join(", ")})`;
  }

  return "none";
}

export function makeTypstDataBinding(data: unknown): string {
  return `#let data = ${toTypstValue(data)}\n`;
}
