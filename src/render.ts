import { execa } from "execa";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { makeTypstDataBinding } from "./template.js";

export type RenderOptions = {
  templatePath: string;
  data: unknown;
  outPath: string;
};

async function ensureDir(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export async function renderDocx(opts: RenderOptions): Promise<void> {
  const template = await fs.readFile(opts.templatePath, "utf8");

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "typst2docx-"));
  const tmpTypPath = path.join(tmpDir, "main.typ");

  const merged = [makeTypstDataBinding(opts.data), "\n", template, "\n"].join("");

  await fs.writeFile(tmpTypPath, merged, "utf8");
  await ensureDir(opts.outPath);

  try {
    await execa("pandoc", [tmpTypPath, "-o", opts.outPath], {
      stdio: "inherit",
    });
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
