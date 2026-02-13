#!/usr/bin/env node
import { Command } from "commander";
import fs from "node:fs/promises";
import { z } from "zod";
import { renderDocx } from "./render.js";

const program = new Command();

program
  .name("typst2docx")
  .description("Generate DOCX from Typst template + JSON data using Pandoc");

program
  .command("render")
  .requiredOption("-t, --template <path>", "Path to .typ template")
  .requiredOption("-d, --data <path>", "Path to .json data")
  .requiredOption("-o, --out <path>", "Output .docx path")
  .action(async (opts: { template: string; data: string; out: string }) => {
    const dataRaw = await fs.readFile(opts.data, "utf8");
    const data = JSON.parse(dataRaw);

    const schema = z.any();
    schema.parse(data);

    await renderDocx({
      templatePath: opts.template,
      data,
      outPath: opts.out,
    });
  });

await program.parseAsync(process.argv);
