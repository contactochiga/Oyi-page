/* eslint-disable @typescript-eslint/no-require-imports -- standalone test loader */
// Loads the site's TypeScript/TSX modules in plain Node for unit and render tests: "@/x" -> src/x, TS/TSX transpiled with the
// React JSX runtime, CSS imports ignored. next/link is replaced by a plain <a> (render tests need no router).
const fs = require("fs"), path = require("path"), Module = require("module"), ts = require("typescript");
const ROOT = path.resolve(__dirname, "../..");
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request === "next/link") return path.join(__dirname, "link-stub.cjs");
  if (request.endsWith(".css")) return path.join(__dirname, "css-stub.cjs");
  if (request.startsWith("@/")) {
    const base = path.join(ROOT, "src", request.slice(2));
    for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) if (fs.existsSync(base + ext)) return base + ext;
  }
  if ((request.startsWith("./") || request.startsWith("../")) && parent && parent.filename) {
    const base = path.resolve(path.dirname(parent.filename), request);
    for (const ext of [".ts", ".tsx"]) if (fs.existsSync(base + ext)) return base + ext;
  }
  return origResolve.call(this, request, parent, ...rest);
};
for (const ext of [".ts", ".tsx"]) {
  require.extensions[ext] = (m, file) => {
    const out = ts.transpileModule(fs.readFileSync(file, "utf8"), { fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    m._compile(out, file);
  };
}
module.exports = { ROOT, load: (rel) => require(path.join(ROOT, rel)) };
