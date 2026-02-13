import express from "express";
import multer from "multer";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { renderDocx } from "./render.js";

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.post(
  "/render",
  upload.fields([
    { name: "template", maxCount: 1 },
    { name: "data", maxCount: 1 },
  ]),
  async (req, res) => {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const templateFile = files?.template?.[0];
    const dataFile = files?.data?.[0];

    if (!templateFile || !dataFile) {
      return res.status(400).json({ error: "template and data are required" });
    }

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "typst2docx-api-"));
    const templatePath = path.join(tmpDir, "template.typ");
    const outPath = path.join(tmpDir, "out.docx");

    try {
      await fs.writeFile(templatePath, templateFile.buffer);
      const data = JSON.parse(dataFile.buffer.toString("utf8"));

      await renderDocx({ templatePath, data, outPath });

      const outBuf = await fs.readFile(outPath);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      res.setHeader("Content-Disposition", 'attachment; filename="report.docx"');
      res.send(outBuf);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  },
);

app.listen(3000, () => {
  console.log("typst2docx server on http://localhost:3000");
});
