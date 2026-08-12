import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiManifest = JSON.parse(await readFile(path.join(root, "specs/api-contract.json"), "utf8"));
const tokenManifest = JSON.parse(
  await readFile(path.join(root, "specs/design-token-contract.json"), "utf8"),
);

const operationSource = await readFile(
  path.join(root, "src/api/operations.generated.js"),
  "utf8",
);
const clientOperations = new Set(
  [...operationSource.matchAll(/^ {2}([A-Za-z][A-Za-z0-9]+):/gm)].map((match) => match[1]),
);
for (const [profile, contract] of Object.entries(apiManifest.profiles)) {
  const missing = contract.requiredOperations.filter((operationId) => !clientOperations.has(operationId));
  if (missing.length) throw new Error(`${profile}: mobile operations missing: ${missing.join(", ")}`);

  const source = await readFile(path.join(root, contract.snapshot), "utf8");
  const digest = createHash("sha256").update(source).digest("hex");
  if (digest !== contract.sha256) throw new Error(`${profile}: API contract changed: received ${digest}`);
  const document = YAML.parse(source);
  for (const [apiPath, methods] of Object.entries(contract.requiredPaths)) {
    for (const method of methods) {
      if (!document.paths?.[apiPath]?.[method]) throw new Error(`${profile}: ${method.toUpperCase()} ${apiPath} absent from OpenAPI`);
    }
  }
}

const localTheme = await readFile(path.join(root, tokenManifest.generatedTarget), "utf8");
const localThemeHash = createHash("sha256").update(localTheme).digest("hex");
if (localThemeHash !== tokenManifest.themeSha256) {
  throw new Error(`Design-token snapshot changed: received ${localThemeHash}`);
}

process.stdout.write("Contracts verified independently for legacy, v2, and the shared theme.\n");
