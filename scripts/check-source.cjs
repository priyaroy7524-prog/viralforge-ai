/* Validates TypeScript/TSX syntax and resolves local @/ imports. Run after npm install. */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const src = path.resolve(__dirname, '../src');
const files = [];
const errors = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(p);
  }
}
walk(src);
for (const file of files) {
  const data = fs.readFileSync(file, 'utf8');
  const res = ts.transpileModule(data, { fileName: file, reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.Preserve, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  for (const issue of res.diagnostics || []) {
    if (issue.category === ts.DiagnosticCategory.Error) errors.push(`${file}: ${ts.flattenDiagnosticMessageText(issue.messageText, ' ')}`);
  }
  for (const match of data.matchAll(/(?:from\s*|import\s*)["'](@\/[^"']+)["']/g)) {
    const resolved = path.join(src, match[1].slice(2));
    if (!['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'].some(suffix => fs.existsSync(resolved + suffix))) errors.push(`${file}: cannot resolve ${match[1]}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`PASS: ${files.length} TS/TSX source files with valid syntax and local imports.`);
