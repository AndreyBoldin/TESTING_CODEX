# typst2docx

TypeScript/Node.js CLI and optional HTTP API to render DOCX from Typst templates and JSON data via Pandoc.

## Install

1. Install Pandoc and confirm Typst input format is available:
   ```bash
   pandoc --list-input-formats | grep typst
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```

## Build

```bash
npm run build
```

## CLI usage

```bash
node dist/cli.js render \
  --template templates/report.typ \
  --data data/example.json \
  --out out/report.docx
```

## API usage

```bash
npm run dev:server
curl -X POST http://localhost:3000/render \
  -F "template=@templates/report.typ" \
  -F "data=@data/example.json" \
  --output out/report.docx
```
