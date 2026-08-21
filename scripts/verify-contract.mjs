import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../specs/api-contract.json", import.meta.url)));
const profile = manifest.profiles["render-v1"];

if (!profile) throw new Error("The Render v1 profile is required.");

const snapshot = await readFile(new URL("../" + profile.snapshot, import.meta.url));
const hash = createHash("sha256").update(snapshot).digest("hex");
if (hash !== profile.sha256) throw new Error("The pinned Render v1 snapshot hash does not match.");

const document = snapshot.toString("utf8");
for (const [path, methods] of Object.entries(profile.requiredPaths)) {
  const start = document.indexOf("  " + path + ":");
  if (start < 0) throw new Error("Missing Render path: " + path);
  const next = document.indexOf("\n  /api/", start + 1);
  const section = document.slice(start, next < 0 ? undefined : next);
  for (const method of methods) {
    if (!section.includes("    " + method + ":")) throw new Error("Missing " + method.toUpperCase() + " " + path);
  }
}

console.log("Render v1 contract verified: " + Object.keys(profile.requiredPaths).length + " paths.");
